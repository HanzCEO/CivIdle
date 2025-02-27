import React, { useEffect, useState } from "react";
import { getGameState } from "../../shared/logic/GameStateLogic";
import { clearShortcuts } from "../../shared/logic/Shortcut";
import type { Tile } from "../../shared/utilities/Helper";
import type { TypedEvent } from "../../shared/utilities/TypedEvent";
import { LoadingPage } from "./ui/LoadingPage";
import { TilePage } from "./ui/TilePage";
import { playClick } from "./visuals/Sound";

export function Route({ event }: { event: TypedEvent<RouteChangeEvent> }) {
   const [{ component, params }, setRoute] = useState<RouteChangeEvent>({
      component: LoadingPage,
      params: {},
   });
   useEffect(() => {
      function handleRouteChanged(e: RouteChangeEvent) {
         if (import.meta.env.DEV) {
            if (e.component === TilePage) {
               console.log(getGameState().tiles.get(e.params.xy as Tile));
            }
         }
         if (e.component !== LoadingPage) {
            playClick();
         }
         clearShortcuts();
         setRoute(e);
      }
      event.on(handleRouteChanged);
      return () => {
         event.off(handleRouteChanged);
      };
   }, [event]);
   return React.createElement(component, params);
}

export interface RouteChangeEvent {
   component: React.ElementType;
   params: Record<string, unknown>;
}
