import classNames from "classnames";
import { getScienceFromWorkers } from "../../../shared/logic/BuildingLogic";
import { GameFeature, hasFeature } from "../../../shared/logic/FeatureLogic";
import { getHappinessIcon } from "../../../shared/logic/HappinessLogic";
import { getResourceAmount } from "../../../shared/logic/ResourceLogic";
import { sizeOf, type Tile } from "../../../shared/utilities/Helper";
import { L, t } from "../../../shared/utilities/i18n";
import { useGameState } from "../Global";
import { useCurrentTick } from "../logic/Tick";
import { TechTreeScene } from "../scenes/TechTreeScene";
import { WorldScene } from "../scenes/WorldScene";
import { Singleton } from "../utilities/Singleton";
import { FormatNumber } from "./HelperComponents";
import { TextWithHelp } from "./TextWithHelpComponent";

export function ResourcePanel(): React.ReactNode {
   const tick = useCurrentTick();
   const gs = useGameState();
   const { workersAvailableAfterHappiness, workersBusy } = getScienceFromWorkers(gs);

   const highlightNotProducingReasons = () => {
      const buildingTiles: Tile[] = Array.from(tick.notProducingReasons.keys());
      Singleton().sceneManager.getCurrent(WorldScene)?.drawSelection(null, buildingTiles);
   };
   return (
      <div className="resource-bar window">
         {tick.happiness ? (
            <div className="row">
               <div
                  className={classNames({
                     "m-icon": true,
                     "text-red": tick.happiness.value < 0,
                     "text-green": tick.happiness.value > 0,
                  })}
               >
                  {getHappinessIcon(tick.happiness.value)}
               </div>
               <div className="f1">
                  <TextWithHelp noStyle placement="bottom" help={t(L.Happiness)}>
                     {tick.happiness.value}
                  </TextWithHelp>
               </div>
            </div>
         ) : null}
         <div className="separator-vertical" />
         <div className="row" style={{ width: "150px" }}>
            <div
               className={classNames({
                  "m-icon": true,
               })}
            >
               person
            </div>
            <div className="f1">
               <TextWithHelp
                  help={`${t(L.WorkersBusy)} / ${t(L.WorkersAvailable)}`}
                  placement="bottom"
                  noStyle
               >
                  <FormatNumber value={workersBusy} /> /{" "}
                  <FormatNumber value={workersAvailableAfterHappiness} />
               </TextWithHelp>
            </div>
         </div>
         <div className="separator-vertical" />
         {hasFeature(GameFeature.Electricity, gs) ? (
            <>
               <div className="row" style={{ width: "150px" }}>
                  <div
                     className={classNames({
                        "m-icon": true,
                        "text-red": (tick.workersAvailable.Power ?? 0) < (tick.workersUsed.Power ?? 0),
                        "text-green": (tick.workersAvailable.Power ?? 0) > (tick.workersUsed.Power ?? 0),
                     })}
                  >
                     bolt
                  </div>
                  <div className="f1">
                     <TextWithHelp
                        placement="bottom"
                        help={`${t(L.PowerUsed)}/${t(L.PowerAvailable)}`}
                        noStyle
                     >
                        <FormatNumber value={tick.workersUsed.Power ?? 0} />W{" / "}
                        <FormatNumber value={tick.workersAvailable.Power ?? 0} />W
                     </TextWithHelp>
                  </div>
               </div>
               <div className="separator-vertical" />
            </>
         ) : null}
         <div className="row pointer" onClick={() => Singleton().sceneManager.loadScene(TechTreeScene)}>
            <div
               className={classNames({
                  "m-icon": true,
               })}
            >
               science
            </div>
            <div className="f1">
               <TextWithHelp help={t(L.Science)} placement="bottom" noStyle>
                  <FormatNumber value={getResourceAmount("Science", gs)} />
               </TextWithHelp>
            </div>
         </div>
         <div className="separator-vertical" />
         <div className="row pointer" onClick={() => highlightNotProducingReasons()}>
            <div
               className={classNames({
                  "m-icon": true,
               })}
            >
               domain_disabled
            </div>
            <div className="f1">
               <TextWithHelp help={t(L.NotProducingBuildings)} placement="bottom" noStyle>
                  <FormatNumber value={sizeOf(tick.notProducingReasons)} />
               </TextWithHelp>
            </div>
         </div>
         <div className="separator-vertical" />
         <div className="row">
            <div
               className={classNames({
                  "m-icon": true,
               })}
            >
               account_balance
            </div>
            <div className="f1">
               <TextWithHelp help={t(L.TotalEmpireValue)} placement="bottom" noStyle>
                  <FormatNumber value={tick.totalValue} />
               </TextWithHelp>
            </div>
         </div>
      </div>
   );
}
