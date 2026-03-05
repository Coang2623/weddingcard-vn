'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { DoubleHappinessIcon, LotusIcon, LanternIcon, RingsIcon, DoveIcon } from './wedding-icons'

const ICONS = [DoubleHappinessIcon, LotusIcon, LanternIcon, RingsIcon, DoveIcon]

export function SnowingIcons() {
    const [windowSize, setWindowSize] = useState<{ width: number, height: number } | null>(null)

    useEffect(() => {
        // Only run on client
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })

        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight })
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (!windowSize) return null

    // Generate 15 random icons
    const snowflakes = Array.from({ length: 20 }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length]
        // Randomize properties
        const size = Math.random() * 25 + 20 // 20px to 45px
        const startX = Math.random() * windowSize.width
        const duration = Math.random() * 12 + 10 // 10s to 22s
        const delay = Math.random() * -20 // Start at different times
        const color = i % 2 === 0 ? 'text-[#8B0000]' : 'text-[#CFB53B]' // Burgundy or Gold
        const opacity = Math.random() * 0.4 + 0.25 // 0.25 to 0.65 opacity

        return { id: i, Icon, size, startX, duration, delay, color, opacity }
    })

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
            {snowflakes.map((flake) => (
                <motion.div
                    key={flake.id}
                    className={`absolute top-0 ${flake.color}`}
                    style={{ opacity: flake.opacity }}
                    initial={{
                        x: flake.startX,
                        y: -50,
                        rotate: 0
                    }}
                    animate={{
                        y: windowSize.height + 50,
                        rotate: 360,
                        x: flake.startX + (Math.random() * 120 - 60) // Slight sway
                    }}
                    transition={{
                        duration: flake.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: flake.delay
                    }}
                >
                    <flake.Icon style={{ width: flake.size, height: flake.size }} />
                </motion.div>
            ))}
        </div>
    )
}
