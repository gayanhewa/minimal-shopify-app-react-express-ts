import * as React from "react";

export const Header = ({heading}: {heading: string}): JSX.Element => {
    return (
        <h1>{heading}</h1>
    )
}
