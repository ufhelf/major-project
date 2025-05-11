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
    isSelectMode: boolean,
    isSelected: boolean,
    onSelect: () => void,
    onDeselect: () => void,
    onDelete: (name:string) => void,
};

export const GalleryImage = ({
    image,
    title,
    index,
    isSelectMode,
    isSelected,
    onSelect,
    onDeselect,
    onDelete,
}: imgprops ) => {
    const { hovered, ref } = useHover();
    const [opened, setOpened] = useState(false);

    const { ref:ref2, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    function HandleClick(){
        if(isSelectMode){
            OnCheck()
        }
        else{

        }
    }

    function OnCheck(){
        if (!isSelected) {
            onSelect();
        }
        else{
            onDeselect();
        }
    }

    return(
        <motion.div
            ref={ref2}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: (index%6) * 0.05 }}
        >
        <AspectRatio mx="auto" ratio={1 / 1} ref={ref} onClick={HandleClick}>
            <motion.div
                className="relative w-full h-full bg-gray-200"
                animate={{
                    scale: isSelected ? 1.03 : 1,
                    boxShadow: isSelected
                    ? "0 0 0 4px rgba(59, 130, 246, 0.5)" 
                    : "0 0 0 0px rgba(0,0,0,0)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <Transition mounted={hovered || isSelected || (opened)} duration={200} transition="fade" timingFunction='ease' onExit={() => setOpened(false)}>
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
                            onClick={(e) => {
                                e.stopPropagation()
                                OnCheck()
                            }}
                            onChange={(e) => {

                            }}
                            className="absolute left-3 top-3" checked={isSelected} 
                            />

                        <Overlay color="#000" backgroundOpacity={0.2} style={{...transitionStyle, zIndex:0}}/>
                        </>
                    )}
                </Transition>
                <Image src={image} alt={title} height={150} className="w-full h-full object-cover" fit="contain" loading='lazy'/>
            </motion.div>
        </AspectRatio>
        </motion.div>
    )
};