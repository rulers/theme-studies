import {
  vertexShader,
  fragmentShader,
  getTransitionFrame,
} from "./move-transitions";

export interface TransitionRenderer {
  upload(sources: readonly TexImageSource[]): void;
  draw(value: number, selectedMode: number, intensity: number): void;
  dispose(): void;
}

export function createTransitionRenderer(
  canvas: HTMLCanvasElement,
): TransitionRenderer {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL unavailable");
  const shaders: WebGLShader[] = [];
  const textures: WebGLTexture[] = [];
  let program: WebGLProgram | null = null;
  let buffer: WebGLBuffer | null = null;
  const dispose = () => {
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  };
  try {
    const compile = (type: number, source: string): WebGLShader => {
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Unable to allocate shader");
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(
          gl.getShaderInfoLog(shader) ?? "Shader compilation failed",
        );
      return shader;
    };
    program = gl.createProgram();
    if (!program) throw new Error("Unable to allocate program");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(
        gl.getProgramInfoLog(program) ?? "Program linking failed",
      );
    gl.useProgram(program);
    buffer = gl.createBuffer();
    if (!buffer) throw new Error("Unable to allocate vertex buffer");
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => {
      if (!program) throw new Error("Program unavailable");
      return gl.getUniformLocation(program, name);
    };
    const progress = uniform("uProgress");
    const mode = uniform("uMode");
    const strength = uniform("uStrength");
    gl.uniform1i(uniform("uFrom"), 0);
    gl.uniform1i(uniform("uTo"), 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    return {
      upload(sources: readonly TexImageSource[]) {
        for (const source of sources) {
          const texture = gl.createTexture();
          if (!texture) throw new Error("Unable to allocate texture");
          textures.push(texture);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            source,
          );
        }
        if (gl.getError() !== gl.NO_ERROR)
          throw new Error("Texture upload failed");
      },
      draw(value: number, selectedMode: number, intensity: number) {
        if (!textures.length || gl.isContextLost()) return;
        const {
          from,
          to,
          progress: amount,
        } = getTransitionFrame(value, textures.length);
        const bounds = canvas.getBoundingClientRect();
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(bounds.width * ratio));
        const height = Math.max(1, Math.round(bounds.height * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        gl.viewport(0, 0, width, height);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, textures[from]);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, textures[to]);
        gl.uniform1f(progress, amount);
        gl.uniform1f(strength, intensity);
        gl.uniform1i(mode, selectedMode);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
