<template>
    <svg style="display: none;">
      <linearGradient id="car-speed-gradient">
        <stop offset="0%" stop-color="#009cff"></stop>
        <stop offset="35%" stop-color="#7300e6"></stop>
        <stop offset="100%" stop-color="#ee0040"></stop>
      </linearGradient>
      <linearGradient id="car-fuel-gradient">
        <stop offset="10%" stop-color="#f19e21"></stop>
        <stop offset="70%" stop-color="#ff2e00"></stop>
      </linearGradient>
      <linearGradient id="vehicle-fuel-gradient">
        <stop offset="10%" stop-color="#f1d021"></stop>
        <stop offset="70%" stop-color="#ff2e00"></stop>
      </linearGradient>
    </svg>
  </template>
  
  <script>
  export default {
    name: 'Gradients',
  };
  </script>
  
  <style scoped>
  /* No additional styling needed; handled by hud.css */
  </style>