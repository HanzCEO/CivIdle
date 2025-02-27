import classNames from "classnames";
import { useEffect, useState } from "react";
import { MAX_TRIBUNE_CARRY_OVER_LEVEL, TRIBUNE_UPGRADE_PLAYTIME } from "../../../shared/logic/Constants";
import { getGameOptions, getGameState } from "../../../shared/logic/GameStateLogic";
import { upgradeAllPermanentGreatPeople } from "../../../shared/logic/RebornLogic";
import { AccountLevel } from "../../../shared/utilities/Database";
import { forEach, formatHM } from "../../../shared/utilities/Helper";
import { L, t } from "../../../shared/utilities/i18n";
import { resetToCity, saveGame, useGameState } from "../Global";
import { AccountLevelImages, AccountLevelNames } from "../logic/AccountLevel";
import { canEarnGreatPeopleFromReborn, client, useUser } from "../rpc/RPCClient";
import { getCountryName, getFlagUrl } from "../utilities/CountryCode";
import { playError } from "../visuals/Sound";
import { ChangePlayerHandleModal } from "./ChangePlayerHandleModal";
import { ConfirmModal } from "./ConfirmModal";
import { showModal, showToast } from "./GlobalModal";
import { RenderHTML } from "./RenderHTMLComponent";
import { TextWithHelp } from "./TextWithHelpComponent";
import { WarningComponent } from "./WarningComponent";

export function PlayerHandleComponent() {
   const user = useUser();
   const gs = useGameState();
   const [showDetails, setShowDetails] = useState(false);
   const accountLevel = user?.level ?? AccountLevel.Tribune;
   return (
      <fieldset>
         <legend>{t(L.PlayerHandle)}</legend>
         {user == null ? (
            <div className="text-strong">{t(L.PlayerHandleOffline)}</div>
         ) : (
            <>
               <div className="row">
                  <div className="text-strong">{user?.handle}</div>
                  <img
                     className="ml5 player-flag"
                     src={getFlagUrl(user?.flag)}
                     title={getCountryName(user?.flag)}
                  />
                  <div className="f1" />
                  <div
                     className={classNames("text-link text-strong", { disabled: !user })}
                     onClick={() => {
                        if (user) {
                           showModal(<ChangePlayerHandleModal />);
                        } else {
                           playError();
                        }
                     }}
                  >
                     {t(L.ChangePlayerHandle)}
                  </div>
               </div>
               <div className="sep5" />
               <div className="row text-strong">
                  <div className="f1">{t(L.AccountLevel)}</div>
                  <img
                     src={AccountLevelImages[accountLevel]}
                     alt={AccountLevelNames[accountLevel]()}
                     className="player-level mr5"
                  />
                  <div>{AccountLevelNames[accountLevel]()}</div>
               </div>
            </>
         )}
         {showDetails ? (
            <AccountDetails />
         ) : (
            <div className="row text-link mt5" onClick={() => setShowDetails(true)}>
               {t(L.AccountTypeShowDetails)}
            </div>
         )}
      </fieldset>
   );
}

function AccountDetails(): React.ReactNode {
   const [playTime, setPlayTime] = useState(0);
   const user = useUser();
   useEffect(() => {
      (async () => {
         if (user?.level === AccountLevel.Tribune) {
            setPlayTime(await client.getPlayTime());
         }
      })();
   }, [user]);
   const cond1 = playTime * 1000 > TRIBUNE_UPGRADE_PLAYTIME;
   return (
      <>
         <div className="separator" />
         <div className="table-view">
            <table>
               <tbody>
                  <tr>
                     <th></th>
                     <th>
                        <TextWithHelp help={AccountLevelNames[AccountLevel.Tribune]()} noStyle>
                           <img className="player-level" src={AccountLevelImages[AccountLevel.Tribune]} />
                        </TextWithHelp>
                     </th>
                     <th>
                        <TextWithHelp help={AccountLevelNames[AccountLevel.Quaestor]()} noStyle>
                           <img className="player-level" src={AccountLevelImages[AccountLevel.Quaestor]} />
                        </TextWithHelp>
                     </th>
                     <th>
                        <TextWithHelp help={AccountLevelNames[AccountLevel.Aedile]()} noStyle>
                           <img className="player-level" src={AccountLevelImages[AccountLevel.Aedile]} />
                        </TextWithHelp>
                     </th>
                     <th>
                        <TextWithHelp help={AccountLevelNames[AccountLevel.Praetor]()} noStyle>
                           <img className="player-level" src={AccountLevelImages[AccountLevel.Praetor]} />
                        </TextWithHelp>
                     </th>
                     <th>
                        <TextWithHelp help={AccountLevelNames[AccountLevel.Consul]()} noStyle>
                           <img className="player-level" src={AccountLevelImages[AccountLevel.Consul]} />
                        </TextWithHelp>
                     </th>
                  </tr>
                  <tr>
                     <td>{t(L.AccountChatBadge)}</td>
                     <td>
                        <div className="m-icon small text-red">cancel</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                  </tr>
                  <tr>
                     <td>{t(L.AccountLeaderboard)}</td>
                     <td>
                        <div className="m-icon small text-red">cancel</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                     <td>
                        <div className="m-icon small text-green">check_circle</div>
                     </td>
                  </tr>
                  <tr>
                     <td>{t(L.AccountActiveTrade)}</td>
                     <td>2</td>
                     <td>4</td>
                     <td>6</td>
                     <td>8</td>
                     <td>10</td>
                  </tr>
                  <tr>
                     <td>{t(L.AccountTradeValuePerMinute)}</td>
                     <td>1,000</td>
                     <td>∞</td>
                     <td>∞</td>
                     <td>∞</td>
                     <td>∞</td>
                  </tr>
                  <tr>
                     <td>{t(L.AccountTradePriceRange)}</td>
                     <td>5%</td>
                     <td>10%</td>
                     <td>15%</td>
                     <td>20%</td>
                     <td>25%</td>
                  </tr>
                  <tr>
                     <td>
                        <TextWithHelp help={t(L.AccountTradeTileReservationTimeDesc)}>
                           {t(L.AccountTradeTileReservationTime)}
                        </TextWithHelp>
                     </td>
                     <td>1d</td>
                     <td>7d</td>
                     <td>14d</td>
                     <td>21d</td>
                     <td>28d</td>
                  </tr>
                  <tr>
                     <td>
                        <TextWithHelp help={t(L.AccountUpgradeCarryOverDesc)}>
                           {t(L.AccountUpgradeCarryOver)}
                        </TextWithHelp>
                     </td>
                     <td>2</td>
                     <td>∞</td>
                     <td>∞</td>
                     <td>∞</td>
                     <td>∞</td>
                  </tr>
               </tbody>
            </table>
         </div>
         <div className="sep5"></div>
         <div className="text-desc text-small">{t(L.TrialRunDesc)}</div>
         <div className="separator" />
         {canEarnGreatPeopleFromReborn() ? (
            <div className="row">
               <div className="f1">{t(L.CanEarnGreatPeopleFromRebornYes)}</div>
               <div className="m-icon ml10 text-green small">check_circle</div>
            </div>
         ) : (
            <div className="row">
               <div className="f1">{t(L.CanEarnGreatPeopleFromRebornNo)}</div>
               <div className="m-icon ml10 text-red small">cancel</div>
            </div>
         )}
         {user?.level === AccountLevel.Tribune ? (
            <>
               <div className="separator" />
               <WarningComponent icon="info">
                  <RenderHTML
                     className="text-small"
                     html={t(L.TribuneUpgradeDesc, { level: MAX_TRIBUNE_CARRY_OVER_LEVEL })}
                  />
               </WarningComponent>
               <div className="sep10" />
               <div className="text-strong">{t(L.AccountLevelUpgradeConditionAny)}</div>
               <div className="sep5" />
               <div className="row">
                  {cond1 ? (
                     <div className="m-icon small text-green mr10">check_circle</div>
                  ) : (
                     <div className="m-icon small text-red mr10">cancel</div>
                  )}
                  <div>
                     {t(L.AccountLevelPlayTime, {
                        requiredTime: formatHM(TRIBUNE_UPGRADE_PLAYTIME),
                        actualTime: formatHM(playTime * 1000),
                     })}
                  </div>
               </div>
               <div className="sep10" />
               <button
                  className="w100 text-strong row"
                  disabled={!cond1}
                  onClick={() => {
                     showModal(
                        <ConfirmModal
                           title={t(L.AccountUpgradeConfirm)}
                           onConfirm={async () => {
                              try {
                                 await client.upgrade();
                                 resetToCity(getGameState().city);
                                 getGameOptions().greatPeopleChoices = [];
                                 upgradeAllPermanentGreatPeople(getGameOptions());
                                 forEach(getGameOptions().greatPeople, (k, v) => {
                                    if (v.level > MAX_TRIBUNE_CARRY_OVER_LEVEL) {
                                       v.level = MAX_TRIBUNE_CARRY_OVER_LEVEL;
                                       v.amount = 0;
                                    }
                                 });
                                 saveGame(true).catch(console.error);
                              } catch (error) {
                                 playError();
                                 showToast(String(error));
                              }
                           }}
                        >
                           <RenderHTML
                              html={t(L.AccountUpgradeConfirmDesc, { level: MAX_TRIBUNE_CARRY_OVER_LEVEL })}
                           />
                        </ConfirmModal>,
                     );
                  }}
               >
                  <div className="m-icon small">vpn_lock</div>
                  <div className="f1 text-center">{t(L.AccountUpgradeButton)}</div>
               </button>
            </>
         ) : null}
      </>
   );
}
