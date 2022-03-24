(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var FinDuJeuPanel = /** @class */ (function () {
        function FinDuJeuPanel(panelManager) {
            this._panelManager = panelManager;
        }
        FinDuJeuPanel.prototype.afficher = function () {
            var titre = "Fermeture de SUTOM";
            var contenu = "<p>" +
                "Suite à une demande de la part de France Télévisions de ne plus utiliser le mot « SUTOM », j'ai décidé de fermer le jeu.<br />" +
                "Le dernier mot sera vendredi 25 mars.<br />" +
                "Merci à toutes les personnes qui ont joué.<br />" +
                'Vous pouvez retrouver plus d\'informations concernant cette fermeture sur <a target="_blank" href="https://twitter.com/Jonamaths/status/1506899535947345921">mon compte twitter, et le thread associé</a>.<br />' +
                "<br />" +
                "Jonathan" +
                "</p>";
            this._panelManager.setContenu(titre, contenu);
            this._panelManager.setClasses(["regles-panel"]);
            this._panelManager.afficherPanel();
        };
        return FinDuJeuPanel;
    }());
    exports.default = FinDuJeuPanel;
});
//# sourceMappingURL=finDuJeuPanel.js.map