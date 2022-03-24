(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./input"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var input_1 = require("./input");
    var PanelManager = /** @class */ (function () {
        function PanelManager() {
            var _this = this;
            this._panelArea = document.getElementById("panel-area");
            this._panelFenetre = document.getElementById("panel-fenetre");
            this._panelTitre = document.getElementById("panel-fenetre-titre");
            this._panelContenu = document.getElementById("panel-fenetre-contenu");
            this._panelFermetureBouton = document.getElementById("panel-fenetre-bouton-fermeture");
            this._panelArea.addEventListener("click", (function (event) {
                event.stopPropagation();
                _this.cacherPanel();
            }).bind(this));
            this._panelFenetre.addEventListener("click", (function (event) {
                event.stopPropagation(); // On évite ainsi de fermer le panel en appuyant sur la fenêtre
            }).bind(this));
            this._panelFermetureBouton.addEventListener("click", (function (event) {
                event.stopPropagation();
                _this.cacherPanel();
            }).bind(this));
        }
        PanelManager.prototype.setInput = function (input) {
            this._input = input;
        };
        PanelManager.prototype.afficherPanel = function () {
            this._panelArea.style.display = "block";
            if (this._input)
                this._input.bloquer(input_1.ContexteBloquage.Panel);
        };
        PanelManager.prototype.cacherPanel = function () {
            this._panelArea.style.display = "none";
            if (this._input)
                this._input.debloquer(input_1.ContexteBloquage.Panel);
        };
        PanelManager.prototype.setContenu = function (titre, contenu) {
            this._panelTitre.innerText = titre;
            this._panelContenu.innerHTML = contenu;
        };
        PanelManager.prototype.setContenuHtmlElement = function (titre, contenu) {
            this._panelTitre.innerText = titre;
            this._panelContenu.innerHTML = "";
            this._panelContenu.appendChild(contenu);
        };
        PanelManager.prototype.setClasses = function (classes) {
            var _this = this;
            this._panelArea.className = "";
            classes.forEach(function (nomClasse) { return _this._panelArea.classList.add(nomClasse); });
        };
        PanelManager.prototype.setCallbackFermeture = function (callback) {
            this._panelFermetureBouton.addEventListener("click", (function (event) {
                callback();
            }).bind(this), { once: true });
        };
        return PanelManager;
    }());
    exports.default = PanelManager;
});
//# sourceMappingURL=panelManager.js.map