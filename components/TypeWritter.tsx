import React, { useState, useEffect } from 'react';
import { Text} from '@/components/Themed';

export const Typewriter: React.FC<{
    text: string | undefined;
    onTypingEnd?: () => void
}> = ({
    text,
    onTypingEnd
}) => {
    const [displayText, setDisplayText] = useState<string>('');

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let index = 0;

        const typeText = () => {
            if (text && (index < displayText.length)) {
                setDisplayText((prevText) => prevText + text.charAt(index));
                index++;
                timer = setTimeout(typeText, 1); 
            } else {
                // onTypingEnd();
            }
        };

        typeText();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [text, onTypingEnd]);

    return text ? <Text>{displayText}</Text> : null;
};

