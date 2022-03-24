var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./entites/configuration", "./entites/lettreStatut", "./instanceConfiguration", "./notificationMessage", "./sauvegardeur"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var configuration_1 = __importDefault(require("./entites/configuration"));
    var lettreStatut_1 = require("./entites/lettreStatut");
    var instanceConfiguration_1 = __importDefault(require("./instanceConfiguration"));
    var notificationMessage_1 = __importDefault(require("./notificationMessage"));
    var sauvegardeur_1 = __importDefault(require("./sauvegardeur"));
    var FinDePartiePanel = /** @class */ (function () {
        function FinDePartiePanel(datePartie, panelManager) {
            var _this = this;
            this._resumeTexte = "";
            this._resumeTexteLegacy = "";
            this._motATrouver = "";
            this._estVictoire = false;
            this._partieEstFinie = false;
            this._datePartie = datePartie;
            this._panelManager = panelManager;
            this._statsButton = document.getElementById("configuration-stats-bouton");
            this._statsButton.addEventListener("click", (function () {
                _this.afficher();
            }).bind(this));
        }
        FinDePartiePanel.prototype.genererResume = function (estBonneReponse, motATrouver, resultats, dureeMs) {
            var _a;
            var resultatsEmojis = resultats.map(function (mot) {
                return mot
                    .map(function (resultat) { return resultat.statut; })
                    .reduce(function (ligne, statut) {
                    switch (statut) {
                        case lettreStatut_1.LettreStatut.BienPlace:
                            return ligne + "🟥";
                        case lettreStatut_1.LettreStatut.MalPlace:
                            return ligne + "🟡";
                        default:
                            return ligne + "🟦";
                    }
                }, "");
            });
            var resultatsEmojisLegacy = resultats.map(function (mot) {
                return mot
                    .map(function (resultat) { return resultat.statut; })
                    .reduce(function (ligne, statut) {
                    switch (statut) {
                        case lettreStatut_1.LettreStatut.BienPlace:
                            return ligne + '<span class="emoji-carre-rouge">🟥</span>';
                        case lettreStatut_1.LettreStatut.MalPlace:
                            return ligne + '<span class="emoji-cercle-jaune">🟡</span>';
                        default:
                            return ligne + '<span class="emoji-carre-bleu">🟦</span>';
                    }
                }, "");
            });
            var dateGrille = this._datePartie.getTime();
            var origine = instanceConfiguration_1.default.dateOrigine.getTime();
            this._motATrouver = motATrouver;
            this._estVictoire = estBonneReponse;
            this._partieEstFinie = true;
            var numeroGrille = Math.floor((dateGrille - origine) / (24 * 3600 * 1000)) + 1;
            var afficherChrono = ((_a = sauvegardeur_1.default.chargerConfig()) !== null && _a !== void 0 ? _a : configuration_1.default.Default).afficherChrono;
            var entete = "SUTOM #" +
                numeroGrille +
                " " +
                (estBonneReponse ? resultats.length : "-") +
                "/6" +
                (afficherChrono ? " " + this.genererTempsHumain(dureeMs) : "") +
                "\n\n";
            this._resumeTexte = entete + resultatsEmojis.join("\n");
            this._resumeTexteLegacy = entete + resultatsEmojisLegacy.join("\n");
        };
        FinDePartiePanel.prototype.genererTempsHumain = function (dureeMs) {
            // Note : Durée est en millisecondes.
            var duree = Math.floor(dureeMs / 1000);
            var retour = "";
            if (duree >= 3600) {
                retour += Math.floor(duree / 3600) + "h";
            }
            retour +=
                Math.floor((duree / 60) % 60)
                    .toString()
                    .padStart(2, "0") + ":";
            retour += Math.floor(duree % 60)
                .toString()
                .padStart(2, "0");
            return retour;
        };
        FinDePartiePanel.prototype.attacherPartage = function () {
            var _this = this;
            var resumeBouton = document.getElementById("fin-de-partie-panel-resume-bouton");
            resumeBouton.addEventListener("click", function (event) {
                event.stopPropagation();
                new Promise(function (resolve, reject) {
                    if (window.navigator.clipboard !== undefined) {
                        return resolve(window.navigator.clipboard.writeText(_this._resumeTexte + "\n\nhttps://sutom.nocle.fr"));
                    }
                    return reject();
                })
                    .catch(function () {
                    return new Promise(function (resolve, reject) {
                        if (window.navigator.share !== undefined)
                            return resolve(navigator.share({ text: _this._resumeTexte + "\n\nhttps://sutom.nocle.fr" }));
                        return reject();
                    });
                })
                    .then(function () {
                    notificationMessage_1.default.ajouterNotificationPanel("Résumé copié dans le presse papier");
                })
                    .catch(function (raison) {
                    notificationMessage_1.default.ajouterNotificationPanel("Votre navigateur n'est pas compatible");
                });
            });
        };
        FinDePartiePanel.prototype.afficher = function () {
            var titre;
            var contenu = "";
            if (!this._partieEstFinie) {
                titre = "Statistiques";
                contenu += '<p class="fin-de-partie-panel-phrase">Vous n\'avez pas encore fini votre partie du jour.</p>';
            }
            else {
                if (this._estVictoire) {
                    titre = "Félicitations";
                    contenu += '<p class="fin-de-partie-panel-phrase">Bravo, tu as gagné. Merci d\'avoir joué :)</p>';
                }
                else {
                    titre = "Perdu";
                    contenu +=
                        '<p class="fin-de-partie-panel-phrase"> \
          Le mot à trouver était : ' +
                            this._motATrouver +
                            "<br /> \
          Merci d'avoir joué :) \
        </p>";
                }
                contenu +=
                    '<p>Résumé de ta partie − <a href="#" id="fin-de-partie-panel-resume-bouton">Partager</a></p> \
          <pre id="fin-de-partie-panel-resume">' +
                        this._resumeTexteLegacy +
                        "</pre>";
            }
            var stats = sauvegardeur_1.default.chargerSauvegardeStats();
            if (stats) {
                contenu +=
                    '<p>Statistiques</p><div class="stats-area"><div class="stats-ligne"><div class="stats-cellule">Parties :</div>' +
                        "<div class=\"stats-cellule\">".concat(stats.partiesGagnees, "/").concat(stats.partiesJouees, "</div>") +
                        "</div>" +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">1/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[1], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">2/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[2], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">3/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[3], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">4/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[4], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">5/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[5], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">6/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition[6], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">-/6\u00A0:</div><div class=\"stats-cellule\">".concat(stats.repartition["-"], "</div></div>") +
                        "<div class=\"stats-ligne\"><div class=\"stats-cellule\">Moyenne :</div><div class=\"stats-cellule\">".concat(this.getMoyenne(stats.repartition), "</div></div>") +
                        '<div class="stats-ligne"><div class="stats-cellule">Lettres :</div>' +
                        '<div class="stats-cellule">' +
                        "".concat(stats.lettresRepartitions.bienPlace, "\u00A0\uD83D\uDFE5 ") +
                        "".concat(stats.lettresRepartitions.malPlace, "\u00A0\uD83D\uDFE1 ") +
                        "".concat(stats.lettresRepartitions.nonTrouve, "\u00A0\uD83D\uDFE6") +
                        "</div>" +
                        "</div>" +
                        "</div>";
            }
            this._panelManager.setContenu(titre, contenu);
            this._panelManager.setClasses(["fin-de-partie-panel"]);
            if (this._partieEstFinie)
                this.attacherPartage();
            this._panelManager.afficherPanel();
        };
        FinDePartiePanel.prototype.getMoyenne = function (repartition) {
            return ((repartition[1] * 1 + repartition[2] * 2 + repartition[3] * 3 + repartition[4] * 4 + repartition[5] * 5 + repartition[6] * 6 + repartition["-"] * 6) /
                (repartition[1] + repartition[2] + repartition[3] + repartition[4] + repartition[5] + repartition[6] + repartition["-"])).toLocaleString("fr-FR", { maximumFractionDigits: 2 });
        };
        return FinDePartiePanel;
    }());
    exports.default = FinDePartiePanel;
});
//# sourceMappingURL=finDePartiePanel.js.map