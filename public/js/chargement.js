/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(function () {
    $('#my_form').on('submit', function (e) {
        // On empêche le navigateur de soumettre le formulaire
        e.preventDefault();
 
        var $form = $(this);
 
        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: $form.serialize(),
            success: function (response) {
                // La réponse du serveur
            }
        });
    });
});

/**
 * 
 * @returns {undefined}
 * aperçu de l'image après selections
 */
$(function () {
    // A chaque sélection de fichier
    $('#my_form').find('input[name="image"]').on('change', function (e) {
        var files = $(this)[0].files;
 
        if (files.length > 0) {
            // On part du principe qu'il n'y qu'un seul fichier
            // étant donné que l'on a pas renseigné l'attribut "multiple"
            var file = files[0],
                $image_preview = $('#image_preview');
 
            // Ici on injecte les informations recoltées sur le fichier pour l'utilisateur
            $image_preview.find('.thumbnail').removeClass('hidden');
            $image_preview.find('img').attr('src', window.URL.createObjectURL(file));
            $image_preview.find('h4').html(file.name);
            $image_preview.find('.caption p:first').html(file.size +' bytes');
        }
    });
 
    // Bouton "Annuler" pour vider le champ d'upload
    $('#image_preview').find('button[type="button"]').on('click', function (e) {
        e.preventDefault();
 
        $('#my_form').find('input[name="image"]').val('');
        $('#image_preview').find('.thumbnail').addClass('hidden');
    });
});