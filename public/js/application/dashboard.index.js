/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Permet le deplacement des blocs sur la page
 */
function WinMove() {
    var element = '[class*=col]';
    var handle = '.ibox-title';
    var connect = '[class*=col]';
    $(element).sortable({
        handle: handle,
        connectWith: connect,
        tolerance: 'pointer',
        forcePlaceholderSize: true,
        opacity: 0.8
    }).disableSelection();
}





$(document).ready(function () {

    WinMove();

    /**
     * Affiche l'alerte de bienvenue a l'utilisateur en cours
     */
    var welcomeInfos = $('#welcomeInfos');
    if (welcomeInfos !== undefined && welcomeInfos !== null && welcomeInfos.length > 0) {
        var isNew = welcomeInfos.data("isnew");
        var wTitle = welcomeInfos.data("title");
        var wText = welcomeInfos.data("text");
        if (isNew.toString() === "1") {
            swal({title: wTitle, text: wText, html: true});
        } else {
            toastr.info(wText, wTitle);
            toastr.options = {
                "closeButton": true,
                "debug": false,
                "newestOnTop": false,
                "progressBar": true,
                "positionClass": "toast-top-right",
                "preventDuplicates": true,
                "onclick": null,
                "showDuration": "300",
                "hideDuration": "1000",
                "timeOut": "5000",
                "extendedTimeOut": "1000",
                "showEasing": "swing",
                "hideEasing": "linear",
                "showMethod": "fadeIn",
                "hideMethod": "fadeOut"
            }
        }
    }
});
