import { Overlay, Card, Transition, Group, Image, Text, AspectRatio, Checkbox, Menu, Button} from '@mantine/core';
import Link from 'next/link';
import { IconLibraryPhoto, IconPointFilled, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import classes from './BadgeCard.module.css';
import { motion } from 'framer-motion';
import { useHover } from '@mantine/hooks';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export interface imgprops{
    image: string,
    title: string,
    index: Number,
    onSelect: () => void,
    onDeselect: () => void,
    onDelete: (name:string) => void,
};

export const GalleryImage = ({
    image,
    title,
    index,
    onSelect,
    onDeselect,
    onDelete,
}: imgprops ) => {
    const { hovered, ref } = useHover();
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);

    const { ref:ref2, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return(
        <motion.div
            ref={ref2}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.05 }}
        >
        <AspectRatio mx="auto" ratio={1 / 1} ref={ref}>
            <div className='relative w-full h-full bg-black bg-gray-200'>
                <Transition mounted={hovered || checked || (opened)} duration={200} transition="fade" timingFunction='ease' onExit={() => setOpened(false)}>
                    {(transitionStyle) =>(
                        <>
                        <Menu opened={opened} onChange={setOpened} withinPortal> 
                            <Menu.Target>
                                <Button 
                                pos="absolute" className='top-3 right-1' 
                                style={{...transitionStyle, zIndex:10}}
                                onClick={(e) => {
                                e.preventDefault()
                                }}
                                variant='transparent' size='xs'>

                                <IconDotsVertical style={{...transitionStyle, zIndex:10, color:'white'}}/>

                                </Button>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item
                                    color="red"
                                    leftSection={<IconTrash size={14} />}
                                    onClick={(e) => {
                                    e.preventDefault()
                                    onDelete(title)
                                }}>
                                    Delete Image
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu> 

                        <Checkbox 
                            size="sm" 
                            radius="xl"
                            style={{...transitionStyle, zIndex:10}} 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-3 top-3" checked={checked} 
                            onChange={(event) => {
                                const isChecked = event.currentTarget.checked;
                                setChecked(isChecked);
                                if (isChecked) {
                                  onSelect();
                                }
                                else{
                                    onDeselect();
                                }
                            }}
                            />

                        <Overlay color="#000" backgroundOpacity={0.2} blur={2} style={{...transitionStyle, zIndex:0}}/>
                        </>
                    )}
                </Transition>
                <Image src={image} alt={title} height={150} className="w-full h-full object-cover" fit="contain" loading='lazy'/>
            </div>
        </AspectRatio>
        </motion.div>
    )
};