"use client"

import { useEffect, useRef } from "react"

export default function KnowledgeGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      ctx.scale(dpr, dpr)
    }

    const drawGraph = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Draw main circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.3, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw connecting lines
      const numLines = 8
      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2
        const innerRadius = Math.min(width, height) * 0.3
        const outerRadius = Math.min(width, height) * 0.45

        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * innerRadius, centerY + Math.sin(angle) * innerRadius)
        ctx.lineTo(centerX + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * outerRadius)
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)"
        ctx.lineWidth = 1
        ctx.stroke()

        // Draw small circles at the end of lines
        ctx.beginPath()
        ctx.arc(centerX + Math.cos(angle) * outerRadius, centerY + Math.sin(angle) * outerRadius, 4, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
        ctx.fill()
      }

      // Draw pulsating inner circle
      const time = Date.now() * 0.001
      const pulseSize = Math.sin(time * 2) * 0.1 + 0.9
      ctx.beginPath()
      ctx.arc(centerX, centerY, Math.min(width, height) * 0.1 * pulseSize, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fill()
    }

    const animate = () => {
      drawGraph()
      requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" />
}

