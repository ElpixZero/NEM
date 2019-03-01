/* eslint-disable no-undef */

$(function() {
  var isShowingLoginForm = true;

  function removeErrors() {
    $('form.login p.error, form.register p.error').remove();
    $('form.login input, form.register input').removeClass('error');
  };

  $('.switch-button').on('click', function(e) {
    e.preventDefault();

    $('input').val('');
    removeErrors();

    if (isShowingLoginForm) {
      isShowingLoginForm = false;
      $('.register').show('slow');
      $('.login').hide();
    } else {
      isShowingLoginForm = true;
      $('.login').show('slow');
      $('.register').hide();
    }
  });
  
  // clear register and logging form
  $('form.login input, form.register input').on('focus', removeErrors);

  // register
  $('.register-button').on('click', function(e) {
  e.preventDefault();

  removeErrors();

  var data = {
    login : $('#register-login').val(),
    password: $('#register-password').val(),
    passwordConfirm: $('#register-password-comfirm').val(),
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/auth/register',
  }).done(function(data) {
    if (!data.ok) {
      $('.register h2').after('<p class="error">' + data.error + '</p>');

      if (data.fields) {
        data.fields.forEach(function(item) {
          $('input[name=' + item + ']').addClass('error');
        });
      } 
      
    } else {
      $(location).attr('href', '/');
    }
    });
  });

  //logging
  $('.login-button').on('click', function(e) {
  e.preventDefault();

  removeErrors();

  var data = {
    login : $('#login-login').val(),
    password: $('#login-password').val()
  };

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/auth/logging',
  }).done(function(data) {
    if (!data.ok) {
      $('.login h2').after('<p class="error">' + data.error + '</p>');

      if (data.fields) {
        data.fields.forEach(function(item) {
          $('input[name=' + item + ']').addClass('error');
        });
      } 
    } else {
      $(location).attr('href', '/');
      console.log('register');
    }
  });
  });

});