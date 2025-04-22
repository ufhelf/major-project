import { Overlay, Card, Transition, Group, Image, Text, AspectRatio, Checkbox, MantineProvider} from '@mantine/core';
import Link from 'next/link';
import { IconLibraryPhoto, IconPointFilled } from '@tabler/icons-react';
import classes from './BadgeCard.module.css';
import { useHover } from '@mantine/hooks';
import { useState } from 'react';

export interface cardprops{
    image: string,
    title: string
};

export const CollectionCard = ({
    image,
    title,
}: cardprops ) => {
    const { hovered, ref } = useHover();
    const [checked, setChecked] = useState(false);
    return(
        <Card withBorder radius="md" p="md" shadow="sm" className={classes.card} ref={ref} component={Link} href={`/images/${title}`}>
            <Card.Section>
                <AspectRatio mx="auto" pos="relative" ratio={16 / 9}>
                <Transition mounted={hovered || checked} duration={200} transition="fade" timingFunction='ease'>
                    {(transitionStyle) =>(
                        <>
                        <Checkbox 
                            size="sm" 
                            radius="xl"
                            style={{...transitionStyle, zIndex:10}} 
                            onClick={(e) => e.stopPropagation()}
                            className="absolute left-3 top-3" checked={checked} 
                            onChange={(event) => setChecked(event.currentTarget.checked)}/>
                        
                        
                        <Overlay color="#000" backgroundOpacity={0.4} blur={2} style={{...transitionStyle, zIndex:0}}/>
                        </>
                    )}
                </Transition>
                <Image src={image} alt={title} height={150}/>
                </AspectRatio>
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
            <Group justify="apart">
                <IconLibraryPhoto></IconLibraryPhoto>
                <Text fz="lg" fw={500}> {title} </Text>
            </Group>
                <Group>
                    <IconPointFilled size={20}/> <Text>100 items</Text>
                </Group>
                <Text>March 21, 2025</Text>
            </Card.Section>
        </Card>
    )
};