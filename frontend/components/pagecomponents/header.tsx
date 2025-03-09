import { Button } from "@mantine/core";

export interface headerprops{
    backgroundcolor?: string,
    text: string
};

export const HeaderThing = ({
    backgroundcolor,
    text,
}: headerprops ) => {
    return(
        <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>
        {text}
        </Button>
    )
};