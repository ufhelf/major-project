import { Overlay, Card, Transition, Group, Image, Text, AspectRatio, Checkbox, Menu, Button} from '@mantine/core';
import Link from 'next/link';
import { IconLibraryPhoto, IconPointFilled, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import classes from './BadgeCard.module.css';
import { useHover } from '@mantine/hooks';
import { useState } from 'react';

export interface cardprops{
    image: string,
    title: string
    date: Date,
    imageCount: string,
    onSelect: () => void,
    onDeselect: () => void,
    onDelete: (name:string) => void,
};

export const CollectionCard = ({
    image,
    title,
    date,
    imageCount,
    onSelect,
    onDeselect,
    onDelete,
}: cardprops ) => {
    const { hovered, ref } = useHover();
    const [opened, setOpened] = useState(false);
    const [checked, setChecked] = useState(false);
    return(
        <Card withBorder radius="md" p="md" shadow="sm" className={classes.card} ref={ref} component={Link} href={`/images/${title}`}>
            <Card.Section>
                <AspectRatio mx="auto" ratio={16 / 9}>
                <div className='relative w-full h-full'>
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
                                    Delete Imageset
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
                <Image src={image} alt={title} height={150} className="w-full h-full object-cover"/>
                </div>
                </AspectRatio>
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
            <Group justify="apart">
                <IconLibraryPhoto></IconLibraryPhoto>
                <Text fz="lg" fw={500}
                    style={{
                        maxWidth: '80%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                {title}
            </Text>

            </Group>
                <Group>
                    <IconPointFilled size={20}/> <Text>{`${imageCount} items`}</Text>
                </Group>
                <Text>{date.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
            </Card.Section>
        </Card>
    )
};