// https://github.com/streamich/react-use/issues/2490
import { RefObject, useEffect, useRef } from "react";
import { off, on } from "react-use/lib/misc/util";

const defaultEvents = ["mousedown", "touchstart"];

export const useClickAways = <E extends Event = Event>(
    ref: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
    onClickAway: (event: E) => void,
    events: string[] = defaultEvents
) => {
    const savedCallback = useRef(onClickAway);
    const savedRefs = useRef<Array<RefObject<HTMLElement | null>>>(
        Array.isArray(ref) ? ref : [ref]
    );

    useEffect(() => {
        savedCallback.current = onClickAway;
        savedRefs.current = Array.isArray(ref) ? ref : [ref];
    }, [onClickAway, ref]);

    useEffect(() => {
        const handler = (event: E) => {
            const clickedOutside = savedRefs.current.every((ref) => {
                const { current: el } = ref;
                return el && !el.contains(event.target as Node);
            });

            if (clickedOutside) {
                savedCallback.current(event);
            }
        };

        for (const eventName of events) {
            on(document, eventName, handler);
        }

        return () => {
            for (const eventName of events) {
                off(document, eventName, handler);
            }
        };
    }, [events]);
};

