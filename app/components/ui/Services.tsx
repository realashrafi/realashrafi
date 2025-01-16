'use client'
import React, {useState} from 'react';
import {HoveredLink, Menu, MenuItem} from "@/app/components/ui/navbar-menu";

function Services({title}:any) {
    const [active, setActive] = useState<string | null>(null);
    return (
        <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item={title}>
                <div className="flex flex-col space-y-4 text-sm">
                    <HoveredLink href="/selfie">{'Smile Room'}</HoveredLink>
                    <HoveredLink href="/moving-cube">{'Hungry Cube'}</HoveredLink>
                    <HoveredLink href="/transform">{'Terminal'}</HoveredLink>
                    <HoveredLink href="/model">{'Model'}</HoveredLink>
                    <HoveredLink href="/model-v2">{'Model V2'}</HoveredLink>
                    <HoveredLink href="/connection">{'Equalizer'}</HoveredLink>
                </div>
            </MenuItem>
        </Menu>
    );
}

export default Services;