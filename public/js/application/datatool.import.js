/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var myDropzone = null;
var uploadedFiles = [];
var currentHashIndex = -1;
var countSyncFailure = 0;
var lastSyncFileInfo = {};
var syncfile = null;

/*Definition de la methode Array.isArray permettant de verifier si une variable est un tableau*/
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

function checkSyncLoading(syncfile) {
    console.log("starting loading");
}

function checkSyncProcess() {
    syncFileHtml = document.querySelectorAll('.syncfile')[currentHashIndex];
    if (syncFileHtml === undefined) {
        runNextSync();
    }
    syncfile = uploadedFiles[currentHashIndex];

    $.ajax({
        url: document.body.dataset.baseuri + "datatool/syncrun",
        context: document.body,
        data: {hash: syncfile.hash, raisealerts: $('#raisealerts').is(':checked') ? '1' : '0'},
        cache: false,
        dataType: "json"
    }).error(function (ajax, status) {
        countSyncFailure++;
    }).success(function (data, status) {
        if (data.error !== undefined) {
            countSyncFailure++;
            syncfile.error = true;
            var errors = Array.isArray(data.error) ? data.error : [data.error];
            syncfile.report = syncfile.report.concat(errors);
        }
        else if (data.success !== undefined) {
            countSyncFailure = 0;
        }
        syncfile.percent = data.percent;
    }).complete(function (ajax, status) {
        syncFileHtml.querySelector('.process').innerText = syncfile.percent + "%";
        syncFileHtml.querySelector('.progress-bar').setAttribute("style", "width:" + syncfile.percent + "%");
        if (syncfile.error) {
            syncFileHtml.querySelector('.progress-bar').classList.remove('progress-bar-navy-light');
            syncFileHtml.querySelector('.progress-bar').classList.add('progress-bar-warning');
        }
        if (syncfile.percent >= 100) {
            setTimeout(runNextSync, 500);
            syncFileHtml.classList.remove('alert-info');
            syncFileHtml.querySelector('.progress').classList.remove('progress-striped', "active");
            syncFileHtml.querySelector('.process').innerHTML = "";
            if (syncfile.error) {
                syncFileHtml.querySelector('.report').classList.remove('hidden');
                syncFileHtml.querySelector('.report').setAttribute("data-hash", currentHashIndex);
            }
        } else {
            setTimeout(checkSyncProcess, 500);
        }
    });
}

/**
 * Verifie l'existence du fichier à synchroniser et charge ses informations
 * @param {type} syncfile
 * @returns void
 */
function checkSyncInfo() {
    syncFileHtml = document.querySelectorAll('.syncfile')[currentHashIndex];
    if (syncFileHtml === undefined) {
        runNextSync();
    }
    syncFileHtml.classList.add('alert-info');
    syncFileHtml.querySelector('.process').innerText = "Recuperation des informations ...";

    $.ajax({
        url: document.body.dataset.baseuri + "datatool/syncinfo",
        context: document.body,
        data: {hash: syncfile.hash},
        cache: false,
        dataType: "json"
    }).error(function (ajax, status) {
        countSyncFailure++;
    }).success(function (data, status) {
        if (data.error !== undefined) {
            countSyncFailure++;
        }
        else if (data.success !== undefined) {
            countSyncFailure = 0;
            syncfile = uploadedFiles[currentHashIndex];
//            lastSyncFileInfo = data;
//            syncfile.percent = data.percent;
            syncfile.error = false;
        }
    }).complete(function (ajax, status) {
        syncfile = uploadedFiles[currentHashIndex];
        if (countSyncFailure === 0) {
            syncFileHtml.querySelector('.process').innerText = syncfile.percent + "%";
            setTimeout(checkSyncProcess, 500);
        } else if (countSyncFailure < 3 && countSyncFailure > 0) {
            setTimeout(checkSyncInfo, 500);
        } else {
            syncFileHtml.querySelectorAll('.process').innerText = "Echec!";
            setTimeout(runNextSync, 500);
        }
    });
}

/**
 * Demarre la sequence de synchronisation du prochain fichier de données
 * @returns {Boolean}
 */
function runNextSync() {
    currentHashIndex++;
    if (uploadedFiles.length - 1 < Number(currentHashIndex)) {
        return false;
    }
    countSyncFailure = 0;
    syncfile = uploadedFiles[currentHashIndex];
    checkSyncInfo();
}




$(document).ready(function () {

    /**
     * Mise en place de la zone de chargement des fichiers
     */
    Dropzone.options.myAwesomeDropzone = {
        previewsContainer: ".dropzone-previews",
        autoProcessQueue: false,
        uploadMultiple: true,
        parallelUploads: 4,
        maxFiles: 4,
        url: document.body.dataset.baseuri + 'datatool/upload',
        createImageThumbnails: false,
        acceptedFiles: ".csv,.txt,.xls,.xlsx",
        previewTemplate: document.querySelector('#preview-template').innerHTML,
        init: function () {
            myDropzone = this;

            $("#doupload").prop('disabled', true);
            $("#doupload").click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                myDropzone.processQueue();
            });
            this.on("addedfile", function (file) {
                $("#doupload").prop('disabled', false);
            });
            this.on("maxfilesreached", function (file) {
                return false;
            });
            this.on("sendingmultiple", function () {
            });
            this.on("successmultiple", function (files, response) {
                for (var i = 0; i < files.length; i++)
                {
                    file = files[i];
                    file.previewElement.querySelector(".remove").classList.add('hidden');
                    file.previewElement.querySelector(".success-mark").classList.remove('hidden');
                    file.previewElement.querySelector(".progress").classList.remove('progress-striped');
                    file.previewElement.querySelector(".progress").classList.remove('active');
                }
                if (!Array.isArray(response)) {
                    return false;
                }
                for (var i = 0; i < response.length; i++)
                {
                    if (response[i].success !== undefined) {
                        var file = {}; //response[i];
                        file.hash = response[i].hash;
                        file.name = response[i].name;
                        file.error = false;
                        file.report = [];
                        file.percent = 0;
                        uploadedFiles[uploadedFiles.length] = file;
                        var newEl = document.createElement("div");
                        newEl.id = file.hash;
                        newEl.setAttribute("class", "syncfile");
                        newEl.setAttribute("data-hash", file.hash);
                        newEl.innerHTML = document.querySelector("#process-template").innerHTML;
                        newEl.querySelector(".filename").innerText = file.name;
                        newEl.querySelector(".report").setAttribute("data-hash", file.hash);
                        ;
                        if (document.querySelectorAll('.syncfile').length === 0) {
                            document.querySelector('#synczone').insertBefore(newEl, document.querySelector('#synczone').firstChild);
                        } else {
                            fileHtmlElmt = document.querySelectorAll('.syncfile')[document.querySelectorAll('.syncfile').length - 1];
                            document.querySelector('#synczone').insertBefore(newEl, fileHtmlElmt.nextSibling);
                        }
                    } else if (response[i].error !== undefined) {

                    }
                }
            });
            this.on("errormultiple", function (files, response) {
                for (var i = 0; i < files.length; i++)
                {
                    file = files[i];
                    file.previewElement.querySelector(".remove").classList.add('hidden');//.setAttribute("class", ".remove hidden");
                    file.previewElement.querySelector(".error-mark").classList.remove('hidden');
                    file.previewElement.querySelector(".progress-bar").classList.add('progress-bar-danger');
                }
            });
//            this.on("completemultiple", function (files) {
//                 for (var i = 0; i < files.length; i++)
//                {
//                    file.previewElement.querySelector(".remove").classList.add('hidden');
//                }
//                console.log(files);
//            });
        }
//        ,
//        accept: function (file, done) {
//            if (this.options.maxFiles===this.getAcceptedFiles()) {
//                done("Naha, you don't.");
//            }
//            else {
//                done();
//            }
//        }

    };

    $("#wizard").steps({
        bodyTag: "fieldset",
        forceMoveForward: true,
        enableCancelButton: true,
        transitionEffect: "slideLeft",
        transitionEffectSpeed: 700,
        startIndex: 0,
        labels: {
            cancel: "Annuler",
            current: "&Eacute;tape :",
            pagination: "Pagination",
            finish: "Terminer",
            next: "Suivant",
            previous: "Pr&eacute;c&eacute;dent",
            loading: "Chargement ..."
        },
        onInit: function (event, currentIndex)
        {
            $("#wizard .actions a[href='#cancel']").hide();
        },
        onStepChanging: function (event, currentIndex, newIndex)
        {
            /**
             * Il n'est pas possible de revenir à l'étape precedente
             */
            if (currentIndex > newIndex)
            {
                return false;
            }
            /**
             * Etape 2
             * On s'assure que les fichiers ont été envoyés sur le serveur avec succès
             */
            if (currentIndex === 1 && uploadedFiles.length === 0)
            {
                return false;
            }
            /**
             * Etape 3
             * on s'assure que les fichiers ont été synchronisés
             */
            if (currentIndex === 2 && currentHashIndex < uploadedFiles.length - 1) {
                return false;
            }
            return true;
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
            /**
             * le bouton Annuler ne s'affiche que durant les étapes 2 et 3
             * A partir du moment où la synchronisation a eu lieu, il n'est plus possible
             * d'annuler le processus
             */
            if (currentIndex > 0 && currentIndex < 3)
            {
                $("#wizard .actions a[href='#cancel']").show();
            } else {
                $("#wizard .actions a[href='#cancel']").hide();
            }

            /**
             * Etape 2
             * on definit l'affichage des fenetres de rapport pour chaque fichier
             * et on ajoute l'évenement click au bouton de synchronisation
             */
            if (currentIndex === 2)
            {
                $('#reportWindows').on('show.bs.modal', function (event) {
                    var eventSource = $(event.relatedTarget);
                    var fileIndex = eventSource.data('hash');
                    if (!(new RegExp('^[0-9]+$', 'i')).test(fileIndex)) {
                        return false;
                    }
                    if (uploadedFiles.length <= fileIndex) {
                        return false;
                    }
                    if (!Array.isArray(uploadedFiles[fileIndex].report)) {
                        return false;
                    }
                    var modal = $(this);
                    var modalBody = modal.find('.modal-body');
                    modalBody.empty();
                    var template = modal.find('#modal-error-line-template');
                    for (var i = 0; i < uploadedFiles[fileIndex].report.length; i++) {
                        var node = template.clone().appendTo(modalBody);
                        node.removeClass('hidden');
                        node.text(uploadedFiles[fileIndex].report[i]);
                        node.attr("id","error-"+i);
                    }
                });

                document.querySelector("#dosync").addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    currentHashIndex = -1;
                    runNextSync();
                });
            }
        },
        onFinishing: function (event, currentIndex)
        {
            return true;
        },
        onFinished: function (event, currentIndex)
        {
            location.reload();
        }
    });
});


