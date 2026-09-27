"use client";

import {
  type HTMLMotionProps,
  motion,
  stagger,
  type Variants,
} from "motion/react";

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(0.06) } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Starts its own orchestration so it animates on mount, even when nested
export function Stagger(props: HTMLMotionProps<"div">) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      {...props}
    />
  );
}

export function StaggerItem(props: HTMLMotionProps<"div">) {
  return <motion.div variants={staggerItem} {...props} />;
}
