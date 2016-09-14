

/**
 * Active ou desactive les champs de planification des date & heure d'envoi de sms
 * @param boolean $isEnable Active ou desactive les champs
 * @returns void
 */
function scheduleMsg($isEnable) {
    $('#senddate').prop('disabled', !$isEnable);
    $('#sendtime').prop('disabled', !$isEnable);
    if ($isEnable) {
        // affiche le calendrier
        $(".input-group.date").datepicker({
            todayBtn: "linked", keyboardNavigation: false, forceParse: false,
            calendarWeeks: true, autoclose: true, format: 'dd/mm/yyyy'
        });
        // Affiche l'horloge pour la selection de l'heure d'envoi du message
        $('.clockpicker').clockpicker({timeFormat: 'H:i'});
    } else {
        // supprime le calendrier
        $(".input-group.date").datepicker("remove");
        // Affiche l'horloge pour la selection de l'heure d'envoi du message
        $(".clockpicker").clockpicker("remove");
    }
}

/**
 * Expression reguliere de verification des numeros de telephone au format international
 * @type String
 */
var PATTERN_PHONE_INTL = "^((?:00|\\+)[1-9][0-9]{9,12})$";
/**
 * Expression reguliere de verification des numeros de telephone au format national
 * @type String
 */
var PATTERN_PHONE_LOCAL = "^(0?[1-9][0-9]{7,10})$";
/**
 * Indicatif de pays par defaut pour les numeros national
 * @type String
 */
var CC_PREFIX = "+229";
/**
 * 
 * @type String
 */
var PATTERN_PHONEBOOK = "^((?:ci|cg|cu)[0-9]+)$";

/**
 * Indique si le chiffre 0 apparaissant en debut des numeros locaux doit etre supprimé
 * avant l'ajout de l'indicatif
 * @type Boolean
 */
var REMOVE_ZERO_PREFIX = true;

$(document).ready(function () {
    selectizedItems = $('#receiver').selectize({
        diacritics: true,
        createOnBlur: false,
        highlight: true,
        persist: true,
        lockOptgroupOrder: true,
        openOnFocus: true,
        hideSelected: true,
        delimiter: ';',
        maxItems: null,
//        preload: true,
        labelField: 'name',
        valueField: 'id',
        searchField: ['name', 'mobile', 'id'],
        plugins: ['restore_on_backspace', 'remove_button'],
        optgroupLabelField: "name",
        optgroupValueField: "sourceid",
        optgroupField: "sourceid",
        optgroups: [],
        options: [],
        sortField: {field: "name", direction: 'asc'},
        render: {
            item: function (item, escape) {
                var itemHtmlNode = document.createElement("div");
                itemHtmlNode.innerHTML = document.querySelector("#phonebook-items-selected-template").innerHTML;
                itemHtmlNode.querySelector(".name").innerText = item.name ? escape(item.name) : escape(item.mobile);
                return itemHtmlNode.outerHTML;
            },
            option: function (item, escape) {
                var isGroup = item.sourceid === "group" ? true : false;
                var optionHtmlNode = document.createElement("div");
                optionHtmlNode.innerHTML = document.querySelector("#phonebook-items-item-template").innerHTML;
                optionHtmlNode.querySelector(".name").innerText = escape(item.name);
                if (!isGroup) {
                    optionHtmlNode.querySelector(".mobile").innerText = escape(item.mobile);
                }
                return optionHtmlNode.outerHTML;
            },
            option_create: function (data, escape) {
                return '<div class="create">Ajouter <strong>' + escape(data.input) + '</strong>&hellip;</div>';
            }
        },
        createFilter: function (input) {
            var regex_local = new RegExp(PATTERN_PHONE_LOCAL, 'i');
            var regex_intl = new RegExp(PATTERN_PHONE_INTL, 'i');
            var regex_phonebook = new RegExp(PATTERN_PHONEBOOK, 'i');
            return regex_local.test(input) || regex_intl.test(input) || regex_phonebook.test(input);
        },
        create: function (input) {
            if ((new RegExp(PATTERN_PHONE_LOCAL, 'i')).test(input)) {
                input = CC_PREFIX + input;
            }
            return {mobile: input, name: input, id: input, sourceid: 'contact'};
        }
    });

    receiversControl = selectizedItems[0].selectize;

    /**
     * Chargement du carnet d'adresse 
     */
    $.ajax({
        url: document.body.dataset.baseuri + 'contact/export?format=json',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            var items = receiversControl.items;
            if (data.error === undefined) {
                receiversControl.clearOptionGroups();
                receiversControl.clearOptions();
                if (data.sources === undefined) {
                    data.sources = [];
                }
                for (var i = 0; i < data.sources.length; i++)
                {
                    var iData = data.sources[i];
                    item = {sourceid: iData.sourceid, name: iData.name};
                    receiversControl.addOptionGroup(item.sourceid, item);
                }
                if (data.contact === undefined) {
                    data.contact = [];
                }
                for (var i = 0; i < data.contact.length; i++)
                {
                    iData = data.contact[i];
                    item = {
                        id: 'ci' + iData.idcontact, //ci:contact item
                        name: iData.nom + " " + iData.prenoms,
                        mobile: "+" + iData.mobile,
                        sourceid: 'contact'
                    };
                    receiversControl.addOption(item);
                }
                if (data.group === undefined) {
                    data.group = [];
                }
                for (var i = 0; i < data.group.length; i++)
                {
                    iData = data.group[i];
                    item = {
                        id: 'cg' + iData.idgroup, //cg:contact group
                        name: iData.nomgroup,
                        mobile: iData.idgroup,
                        sourceid: 'group'
                    };
                    receiversControl.addOption(item);
                }
//                receiversControl.refreshOptions();
                for (var index in  items) {
                    element = items[index];
                    if (receiversControl.options.hasOwnProperty(element)) {
                        receiversControl.addItem(element);
                    } else {
                        if ((new RegExp('^[0-9]+$', 'i')).test(element)) {
                            element = '+' + element;
                        }
                        if ((new RegExp(PATTERN_PHONE_INTL, 'i')).test(element)) {
                            var iOption = {id: element, name: element, mobile: element, sourceid: 'contact'};
                            receiversControl.addOption(iOption);
                            receiversControl.addItem(element);
                        }
                    }
                }
            } else {
                receiversControl.setValue(items);
            }
        }
    });


// Attache le calendrier et l'horloge aux champs date et heure
    scheduleMsg(true);
    // active ou desactive le calendrier et l'horloge
    scheduleMsg($("#isscheduled").is(':checked'));
    //Attache l'activation et la desactive du calendrier et de l'horloge en fonction 
    //de la valeur de la case à cocher isscheduled
    $('#isscheduled').change(function () {
        scheduleMsg($("#isscheduled").is(':checked'));
    });
    //insert le texte du modele de sms suite au click sur le bouton inserer
    $(".insertModel").click(function () {
        var tagId = this.dataset.idmodel;
        if (tagId !== "undefined" && $("#" + tagId) !== "undefined") {
            $("#message").text($("#" + tagId).text());
            $("#modelesWindow").modal('hide');
        }
    });
});