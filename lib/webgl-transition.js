import {
  vertexShader,
  fragmentShader,
  getTransitionFrame,
} from "./move-transitions.js";

export function createTransitionRenderer(canvas) {
  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("WebGL unavailable");
  const shaders = [];
  const textures = [];
  let program;
  let buffer;
  const dispose = () => {
    textures.forEach((texture) => gl.deleteTexture(texture));
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
  };
  try {
    const compile = (type, source) => {
      const shader = gl.createShader(type);
      shaders.push(shader);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(gl.getShaderInfoLog(shader));
      return shader;
    };
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexShader));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentShader));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const position = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name) => gl.getUniformLocation(program, name);
    const progress = uniform("uProgress");
    const mode = uniform("uMode");
    const strength = uniform("uStrength");
    gl.uniform1i(uniform("uFrom"), 0);
    gl.uniform1i(uniform("uTo"), 1);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    return {
      upload(sources) {
        for (const source of sources) {
          const texture = gl.createTexture();
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
      draw(value, selectedMode, intensity) {
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
