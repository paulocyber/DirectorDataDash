export type DrawerSettingsItems = {
    Component: React.ComponentType<any>
    props: Record<string, any>
    clear: () => void
}