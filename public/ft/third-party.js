// Stand-in third-party script for /feature-tests/third-party-scripts.
window.__ftThirdParty = { ranAt: performance.now() };
document.documentElement.setAttribute('data-ft-third-party', 'loaded');
