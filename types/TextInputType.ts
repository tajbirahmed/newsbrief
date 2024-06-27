export interface TextInputType { 
    label: string; 
    content: string; 
    setContent: (content: string) => void; 
    hidden?: boolean
    error?: boolean | null
    onChange?: () => void, 
    onEndEditing?: () => void
    readonly?: boolean
}