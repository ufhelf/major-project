import type { Meta, StoryObj } from "@storybook/react"
import { CollectionCard } from "./collectionCard"
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof CollectionCard> = {
    title: 'Components/pagecomponents/CollectionCard',
    component: CollectionCard,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        actions: { onclick : fn() }
    },
};

export default meta
type Story = StoryObj<typeof CollectionCard>;