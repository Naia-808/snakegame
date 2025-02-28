function draw() {
  // Draw chessboard pattern
  for (let x = 0; x < tileCount; x++) {
      for (let y = 0; y < tileCount; y++) {
          ctx.fillStyle = (x + y) % 2 === 0 ? "#fff3b0" : "#ffe082"; // Light yellow and dark yellow
          ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
      }
  }

  // Draw snake
  snake.forEach((segment, index) => {
      // Draw the snake's body (kawaii style)
      ctx.fillStyle = "#76c7c0"; // Teal green for the snake's body
      ctx.beginPath();
      ctx.arc(
          segment.x * gridSize + gridSize / 2,
          segment.y * gridSize + gridSize / 2,
          gridSize / 2 - 1,
          0,
          Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();

      // Draw kawaii face on the head
      if (index === 0) {
          // Eyes
          ctx.fillStyle = "#000"; // Black for the eyes
          ctx.beginPath();
          ctx.arc(
              segment.x * gridSize + gridSize / 2 - 5,
              segment.y * gridSize + gridSize / 2 - 5,
              2,
              0,
              Math.PI * 2
          );
          ctx.arc(
              segment.x * gridSize + gridSize / 2 + 5,
              segment.y * gridSize + gridSize / 2 - 5,
              2,
              0,
              Math.PI * 2
          );
          ctx.fill();
          ctx.closePath();

          // Blush (directly below the eyes)
          ctx.fillStyle = "#ff6f61"; // Coral color for blush
          ctx.beginPath();
          ctx.arc(
              segment.x * gridSize + gridSize / 2 - 5,
              segment.y * gridSize + gridSize / 2 + 5, // Blush below the left eye
              3,
              0,
              Math.PI * 2
          );
          ctx.arc(
              segment.x * gridSize + gridSize / 2 + 5,
              segment.y * gridSize + gridSize / 2 + 5, // Blush below the right eye
              3,
              0,
              Math.PI * 2
          );
          ctx.fill();
          ctx.closePath();
      }
  });

  // Draw fruits
  ctx.font = `${gridSize}px Arial`;
  food.forEach(fruit => {
      ctx.fillText(fruit.emoji, fruit.x * gridSize, fruit.y * gridSize + gridSize);
  });
}