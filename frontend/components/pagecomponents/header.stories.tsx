import type { Meta, StoryObj } from "@storybook/react"
import { HeaderThing } from "./header"
import { fn } from '@storybook/test';
import { action } from '@storybook/addon-actions'

const meta: Meta<typeof HeaderThing> = {
    title: 'Components/pagecomponents/Header',
    component: HeaderThing,
    tags: ["autodocs"],
    parameters: {
        layout: "centered",
        actions: { onclick : fn() }
    },
};

export default meta
type Story = StoryObj<typeof HeaderThing>;