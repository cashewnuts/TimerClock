const clockUtils = {
  getTheta(deg) {
    return (deg / 360) * (2 * Math.PI);
  },
  getX(deg) {
    return Math.cos(clockUtils.getTheta(deg));
  },
  getY(deg) {
    return Math.sin(clockUtils.getTheta(deg));
  },
  getXY(deg) {
    return {
      x: clockUtils.getX(deg),
      y: clockUtils.getY(deg)
    };
  },
  getTimeDeg60(val) {
    return (360 / 60) * val - 90;
  },
  getTimeDeg12(val) {
    return (360 / 12) * val - 90;
  }
};

export default clockUtils;
