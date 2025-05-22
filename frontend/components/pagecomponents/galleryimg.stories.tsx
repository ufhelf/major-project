import type { Meta, StoryObj } from "@storybook/react"
import { GalleryImage } from "./galleryimg";
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof GalleryImage> = {
    title: 'Components/pagecomponents/GalleryImage',
    component: GalleryImage,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        actions: { onclick : fn() }
    },
};

export default meta 
type Story = StoryObj<typeof GalleryImage>;
export const Default: Story = {};