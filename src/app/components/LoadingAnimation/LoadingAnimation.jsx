import React from 'react';
import { motion } from 'framer-motion';
// import { Play, Zap } from 'lucide-react';
import './LoadingAnimation.css';

export default function LoadingAnimation() {
    return (
        <div className="loading-container">
            {/* Background elements */}
            <div className="loading-background">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="floating-dot"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{ y: [0, -100, 0], opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: i * 0.5, ease: 'easeInOut' }}
                    />
                ))}
            </div>

            <div className="loading-content">
                <motion.div
                    initial={{ scale: 0, rotateY: -180 }}
                    animate={{ scale: 1, rotateY: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="logo-wrapper"
                    style={{ perspective: '1000px' }}
                >
                    <motion.div
                        animate={{ rotateY: [0, 360], scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="logo"
                    >
                        <motion.div
                            className="logo-glow"
                            animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            <i className='fa-solid fa-play'></i>
                        </motion.div>
                    </motion.div>

                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="orbit-dot"
                            style={{ top: '50%', left: '50%' }}
                            animate={{
                                rotate: [0, 360],
                                x: [0, Math.cos((i * 2 * Math.PI) / 3) * 80],
                                y: [0, Math.sin((i * 2 * Math.PI) / 3) * 80],
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                        />
                    ))}
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 50, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="loading-title"
                >
                    <motion.span
                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="title-gradient"
                    >
                        Xnova
                    </motion.span>
                </motion.h1>

                <div className="loading-dots">
                    {[...Array(4)].map((_, index) => (
                        <motion.div
                            key={index}
                            className="loading-dot"
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1.5, 0], rotateY: [0, 180, 360] }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2, ease: 'easeInOut' }}
                        />
                    ))}
                </div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="loading-text"
                >
                    <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        Preparing your ultimate football experience
                    </motion.span>
                </motion.p>

                <div className="progress-container">
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2.5, ease: 'easeInOut' }}
                        >
                            <motion.div
                                className="progress-shine"
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            />
                        </motion.div>
                    </div>
                </div>

                <motion.div
                    className="floating-box green"
                    animate={{ y: [0, -30, 0], rotateX: [0, 15, 0], rotateY: [0, 25, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                />

                <motion.div
                    className="floating-box purple"
                    animate={{ y: [0, 40, 0], rotateX: [0, -20, 0], rotateY: [0, -30, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />

                <motion.div
                    className="lightning-bolt"
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                >
                    {/* <Zap className="bolt-icon" fill="#A8FF00" /> */}
                    <i className='fa-solid fa-zap'></i>
                </motion.div>
            </div>
        </div>
    )
}
