import { Overlay, Card, Transition, Group, Image, Text, AspectRatio, Checkbox, Menu, Button} from '@mantine/core';
import { motion } from 'framer-motion';
import { useHover } from '@mantine/hooks';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export interface imgprops{
    image: string,
    title: string,
    index: Number,
};

export const ViewImage = ({
    image,
    title,
    index,
}: imgprops ) => {
    const { hovered, ref } = useHover();

    const { ref:ref2, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return(
        <motion.div
            ref={ref2}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: (index%6) * 0.05 }}
        >
        <AspectRatio mx="auto" ratio={1 / 1} ref={ref}>
            <div className="relative w-full h-full">
                <Transition mounted={hovered} duration={200} transition="fade" timingFunction='ease'>
                    {(transitionStyle) =>(
                        <>
                        <Overlay color="#000" backgroundOpacity={0.2} style={{...transitionStyle, zIndex:0}}/>
                        </>
                    )}
                </Transition>
                <Image src={image} alt={title} height={150} className="w-full h-full object-cover" fit="contain" loading='lazy'/>
            </div>
        </AspectRatio>
        </motion.div>
    )
};