/* global wp, jQuery */
/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */
( function( $ ) {
    const themeContstants = {
		prefix: 'newsmatic_'
	}
	const themeCalls = {
		newsmaticGenerateStyleTag: function( code, id ) {
			if( code ) {
				if( $( "head #" + id ).length > 0 ) {
					$( "head #" + id ).html( code )
				} else {
					$( "head" ).append( '<style id="' + id + '">' + code + '</style>' )
				}
			}
		},
		newsmaticGenerateLinkTag: function( action, id ) {
			$.ajax({
				method: "GET",
				url: newsmaticPreviewObject.ajaxUrl,
				data: ({
					action: action,
					_wpnonce: newsmaticPreviewObject._wpnonce
				}),
				success: function(response) {
					if( response ) {
						if( $( "head #" + id ).length > 0 ) {
							$( "head #" + id ).attr( "href", response )
						} else {
							$( "head" ).append( '<link rel="stylesheet" id="' + id + '" href="' + response + '"></link>' )
						}
					}
				}
			})
		},
		newsmaticGenerateTypoCss: function(selector,value) {
			var cssCode = ''
			if( value.font_family ) {
				cssCode += '.newsmatic_font_typography { ' + selector + '-family: ' + value.font_family.value + '; } '
			}
			if( value.font_weight ) {
				cssCode += '.newsmatic_font_typography { ' + selector + '-weight: ' + value.font_weight.value + '; } '
			}
			if( value.text_transform ) {
				cssCode += '.newsmatic_font_typography { ' + selector + '-texttransform: ' + value.text_transform + '; } '
			}
			if( value.text_decoration ) {
				cssCode += '.newsmatic_font_typography { ' + selector + '-textdecoration: ' + value.text_decoration + '; } '
			}
			if( value.font_size ) {
				if( value.font_size.desktop ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-size: ' + value.font_size.desktop + 'px; } '
				}
				if( value.font_size.tablet ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-size-tab: ' + value.font_size.tablet + 'px; } '
				}
				if( value.font_size.smartphone ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-size-mobile: ' + value.font_size.smartphone + 'px; } '
				}
			}
			if( value.line_height ) {
				if( value.line_height.desktop ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-lineheight: ' + value.line_height.desktop + 'px; } '
				}
				if( value.line_height.tablet ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-lineheight-tab: ' + value.line_height.tablet + 'px; } '
				}
				if( value.line_height.smartphone ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-lineheight-mobile: ' + value.line_height.smartphone + 'px; } '
				}
			}
			if( value.letter_spacing ) {
				if( value.letter_spacing.desktop ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-letterspacing: ' + value.letter_spacing.desktop + 'px; } '
				}
				if( value.letter_spacing.tablet ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-letterspacing-tab: ' + value.letter_spacing.tablet + 'px; } '
				}
				if( value.letter_spacing.smartphone ) {
					cssCode += '.newsmatic_font_typography { ' + selector + '-letterspacing-mobile: ' + value.letter_spacing.smartphone + 'px; } '
				}
			}
			return cssCode
		}
	}

	// theme color bind changes
	wp.customize( 'theme_color', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-color-style', '--theme-color-red')
		});
	});

	// preset 1 bind changes
	wp.customize( 'preset_color_1', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-1-style', '--newsmatic-global-preset-color-1')
		});
	});

	// preset 2 bind changes
	wp.customize( 'preset_color_2', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-2-style', '--newsmatic-global-preset-color-2')
		});
	});

	// preset 3 bind changes
	wp.customize( 'preset_color_3', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-3-style', '--newsmatic-global-preset-color-3')
		});
	});

	// preset 4 bind changes
	wp.customize( 'preset_color_4', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-4-style', '--newsmatic-global-preset-color-4')
		});
	});

	// preset 5 bind changes
	wp.customize( 'preset_color_5', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-5-style', '--newsmatic-global-preset-color-5')
		});
	});

	// preset 6 bind changes
	wp.customize( 'preset_color_6', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-6-style', '--newsmatic-global-preset-color-6')
		});
	});

	// preset 7 bind changes
	wp.customize( 'preset_color_7', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-7-style', '--newsmatic-global-preset-color-7')
		});
	});

	// preset 8 bind changes
	wp.customize( 'preset_color_8', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-8-style', '--newsmatic-global-preset-color-8')
		});
	});

	// preset 9 bind changes
	wp.customize( 'preset_color_9', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-9-style', '--newsmatic-global-preset-color-9')
		});
	});

	// preset 10 bind changes
	wp.customize( 'preset_color_10', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-10-style', '--newsmatic-global-preset-color-10')
		});
	});

	// preset 11 bind changes
	wp.customize( 'preset_color_11', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-11-style', '--newsmatic-global-preset-color-11')
		});
	});

	// preset 12 bind changes
	wp.customize( 'preset_color_12', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-color-12-style', '--newsmatic-global-preset-color-12')
		});
	});

	// preset gradient 1 bind changes
	wp.customize( 'preset_gradient_1', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-1-style', '--newsmatic-global-preset-gradient-color-1')
		});
	});

	// preset gradient 2 bind changes
	wp.customize( 'preset_gradient_2', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-2-style', '--newsmatic-global-preset-gradient-color-2')
		});
	});

	// preset gradient 3 bind changes
	wp.customize( 'preset_gradient_3', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-3-style', '--newsmatic-global-preset-gradient-color-3')
		});
	});

	// preset gradient 4 bind changes
	wp.customize( 'preset_gradient_4', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-4-style', '--newsmatic-global-preset-gradient-color-4')
		});
	});

	// preset gradient 5 bind changes
	wp.customize( 'preset_gradient_5', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-5-style', '--newsmatic-global-preset-gradient-color-5')
		});
	});

	// preset gradient 6 bind changes
	wp.customize( 'preset_gradient_6', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-6-style', '--newsmatic-global-preset-gradient-color-6')
		});
	});

	// preset gradient 7 bind changes
	wp.customize( 'preset_gradient_7', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-7-style', '--newsmatic-global-preset-gradient-color-7')
		});
	});

	// preset gradient 8 bind changes
	wp.customize( 'preset_gradient_8', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-8-style', '--newsmatic-global-preset-gradient-color-8')
		});
	});

	// preset gradient 9 bind changes
	wp.customize( 'preset_gradient_9', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-9-style', '--newsmatic-global-preset-gradient-color-9')
		});
	});

	// preset gradient 10 bind changes
	wp.customize( 'preset_gradient_10', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-10-style', '--newsmatic-global-preset-gradient-color-10')
		});
	});

	// preset gradient 11 bind changes
	wp.customize( 'preset_gradient_11', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-11-style', '--newsmatic-global-preset-gradient-color-11')
		});
	});

	// preset gradient 12 bind changes
	wp.customize( 'preset_gradient_12', function( value ) {
		value.bind( function( to ) {
			helperFunctions.generateStyle(to, 'theme-preset-gradient-color-12-style', '--newsmatic-global-preset-gradient-color-12')
		});
	});
	
	// site block border top
	wp.customize( 'website_block_border_top_option', function( value ) {
		value.bind( function(to) {
			if( to ) {
				$( "body" ).addClass( "newsmatic_site_block_border_top" )
			} else {
				$( "body" ).removeClass( "newsmatic_site_block_border_top" )
			}
		});
	});

    // website style block top color
	wp.customize( 'website_block_border_top_color', function( value ) {
		value.bind( function( to ) {
            var value = JSON.parse( to )
            var cssCode = 'body.newsmatic_font_typography { --theme-block-top-border-color: '+ helperFunctions.getFormatedColor( value[value.type] ) + '}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-block-border-top-color' )
		});
	});

    // website layout
	wp.customize( 'website_layout', function( value ) {
		value.bind( function( to ) {
            $('body').removeClass('site-boxed--layout site-full-width--layout').addClass( 'site-' + to )
		});
	});
    
    // post title hover effect
	wp.customize( 'post_title_hover_effects', function( value ) {
		value.bind( function( to ) {
            $('body').removeClass('newsmatic-title-none newsmatic-title-one newsmatic-title-two').addClass( 'newsmatic-title-' + to )
		});
	});

    // image hover effect
	wp.customize( 'site_image_hover_effects', function( value ) {
		value.bind( function( to ) {
            $('body').removeClass('newsmatic-image-hover--effect-none newsmatic-image-hover--effect-one newsmatic-image-hover--effect-two').addClass( 'newsmatic-image-hover--effect-' + to )
		});
	});
		
	// scroll to top visibility
	wp.customize( 'stt_responsive_option', function( value ) {
		value.bind(function( to ){
			var cssCode = ''
			if( ! to.desktop ) {
				cssCode += 'body #newsmatic-scroll-to-top.show { display: none }';
			}
			if( ! to.tablet ) {
				cssCode += '@media(max-width: 940px) { body #newsmatic-scroll-to-top.show { display : none } }'
			} else {
				cssCode += '@media(max-width: 940px) { body #newsmatic-scroll-to-top.show { display : block } }'
			}
			if( to.mobile ) {
				cssCode += '@media(max-width: 610px) { body #newsmatic-scroll-to-top.show { display : block } }'
			} else {
				cssCode += '@media(max-width: 610px) { body #newsmatic-scroll-to-top.show { display : none } }'
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-scroll-to-top-responsive-option' )
		})
	})

	// scroll to top align
	wp.customize( 'stt_alignment', function( value ) {
		value.bind( function( to ) {
			$( "#newsmatic-scroll-to-top" ).removeClass( "align--left align--center align--right" )
			$( "#newsmatic-scroll-to-top" ).addClass( "align--" + to )
		});
	});

	// scroll to top icon text color
	wp.customize('stt_color_group', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--move-to-top-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-stt-icon-text-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-stt-icon-text-color' )
			}
		})
	})

	// scroll to top background
	wp.customize('stt_background_color_group', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--move-to-top-background-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-stt-background-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-stt-background-color' )
			}
		})
	})

	// site logo width
	wp.customize( 'newsmatic_site_logo_width', function( value ) {
		value.bind( function( to ) {
			var cssCode = ''
			if( to.desktop ) {
				cssCode += 'body .site-branding img.custom-logo { width: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { body .site-branding img.custom-logo { width: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {
				cssCode += '@media(max-width: 610px) { body .site-branding img.custom-logo { width: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-site-logo-width' )
		})
	})

	// site title typo
	wp.customize('site_title_typo', function( value ) {
		value.bind(function( to ) {
			ajaxFunctions.typoFontsEnqueue()
			var cssCode = ''
			var selector = '--site-title'
			cssCode = themeCalls.newsmaticGenerateTypoCss(selector,to)
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-site-title-typo' )
		})
	})

	// site tagline typo
	wp.customize('site_tagline_typo', function( value ) {
		value.bind(function( to ) {
			ajaxFunctions.typoFontsEnqueue()
			var cssCode = ''
			var selector = '--site-tagline'
			cssCode = themeCalls.newsmaticGenerateTypoCss(selector,to)
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-site-tagline-typo' )
		})
	})

	// Header text color.
	wp.customize( 'header_textcolor', function( value ) {
		value.bind( function( to ) {
			if ( 'blank' === to ) {
				$( '.site-title' ).css( {
					clip: 'rect(1px, 1px, 1px, 1px)',
					position: 'absolute',
				} );
			} else {
				$( '.site-title' ).css( {
					clip: 'auto',
					position: 'relative',
				} );
				themeCalls.newsmaticGenerateStyleTag( 'header .site-title a { color : ' + to + ' }', 'newsmatic-site-title-color' )
			}
		} );
	});

	// blog description
	wp.customize( 'blogdescription_option', function( value ) {
		value.bind(function(to) {
			if( to ) {
				$( '.site-description' ).css( {
					clip: 'auto',
					position: 'relative',
				} );
			} else {
				$( '.site-description' ).css( {
					clip: 'rect(1px, 1px, 1px, 1px)',
					position: 'absolute',
				} );
			}
		})
	});

	// site title hover color
	wp.customize( 'site_title_hover_textcolor', function( value ) {
		value.bind( function( to ) {
			var color = helperFunctions.getFormatedColor( to )
			themeCalls.newsmaticGenerateStyleTag( 'header .site-title a:hover { color : ' + color + ' }', 'newsmatic-site-title-hover-color' )
		})
	})

	// site description color
	wp.customize( 'site_description_color', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).css( {
				color: to,
			});
		} );
	});
	
	// category colors text colors
	var parsedCats = newsmaticPreviewObject.totalCats
	if( parsedCats ) {
		parsedCats = Object.keys( parsedCats ).map(( key ) => { return parsedCats[key] })
		parsedCats.forEach(function(item) {
			wp.customize( 'category_' + item.term_id + '_color', function( value ) {
				value.bind( function(to) {
					var cssCode = ''
					if( to ) {
						cssCode += "body article:not(.newsmatic-category-no-bk) .post-categories .cat-item.cat-" + item.term_id + " a { background : " + helperFunctions.getFormatedColor( to ) + " } "
						cssCode += "body .newsmatic-category-no-bk .post-categories .cat-item.cat-" + item.term_id + " a { color : " + helperFunctions.getFormatedColor( to ) + " } "
					}
					themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-category-' + item.term_id + '-style' )
				})
			})
		})
	}

	// header elements order class
	wp.customize( 'main_header_elements_order', function( value ) {
		value.bind( function(to) {
				$( ".main-header" ).removeClass( "order--buttons-logo-social order--social-logo-buttons" )
				$( ".main-header" ).addClass( "order--" + to )
		});
	});

	// main header vertical padding
	wp.customize( 'header_vertical_padding', function( value ) {
		value.bind( function( to ) {
            var cssCode = ''
            if( to.desktop ) {
				cssCode += 'body.newsmatic_font_typography { --header-padding: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { body.newsmatic_font_typography { --header-padding-tablet: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {				
				cssCode += '@media(max-width: 610px) { body.newsmatic_font_typography { --header-padding-smartphone: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-header-vertical-padding' )
		});
	});

	// main header toggle bar color
	wp.customize('header_sidebar_toggle_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--sidebar-toggle-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-header-toggle-bar-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-main-header-toggle-bar-color' )
			}
		})
	})

	// main header search icon color
	wp.customize('header_search_icon_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--search-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-header-search-icon-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-main-header-search-icon-color' )
			}
		})
	})

	// header menu hover effect 
	wp.customize( 'header_menu_hover_effect', function( value ) {
		value.bind( function(to) {
			$( "#site-navigation" ).removeClass( "hover-effect--one hover-effect--none" )
			$( "#site-navigation" ).addClass( "hover-effect--" + to )
		});
	});

	// menu options text color
	wp.customize('header_menu_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--menu-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-menu-options-text-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-menu-options-text-color' )
			}
		})
	})
	
	// custom button icon text color
	wp.customize('header_custom_button_color_group', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--custom-btn-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-custom-button-icon-text-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-custom-button-icon-text-color' )
			}
		})
	})

	// custom buttom background
	wp.customize( 'header_custom_button_background_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = 'body.newsmatic_font_typography .header-custom-button { background: '+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-custom-button-background' )
		})
	})

	// custom buttom background hover
	wp.customize( 'header_custom_button_background_hover_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = 'body.newsmatic_font_typography .header-custom-button:hover { background: '+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-custom-button-background-hover' )
		})
	})

	// main banner slider image border radius
	wp.customize( 'banner_slider_image_border_radius', function( value ) {
		value.bind( function( to ) {
            var cssCode = ''
            var selector = '#main-banner-section .main-banner-slider figure.post-thumb, #main-banner-section .main-banner-slider .post-element'
            if( to.desktop ) {
				cssCode += selector +' { border-radius: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { '+ selector +' { border-radius: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {				
				cssCode += '@media(max-width: 610px) { '+ selector +' { border-radius: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-bannr-slider-border-radius' )
		});
	});

	// main banner block image border radius
	wp.customize( 'banner_slider_block_posts_image_border_radius', function( value ) {
		value.bind( function( to ) {
            var cssCode = ''
            var selector = '#main-banner-section .main-banner-trailing-posts figure.post-thumb, #main-banner-section .banner-trailing-posts figure.post-thumb, #main-banner-section .banner-trailing-posts .post-element'
            if( to.desktop ) {
				cssCode += selector +' { border-radius: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { '+ selector +' { border-radius: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {				
				cssCode += '@media(max-width: 610px) { '+ selector +' { border-radius: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-bannr-block-border-radius' )
		});
	});

	// main banner slider image border radius
	wp.customize( 'main_banner_five_trailing_posts_layout', function( value ) {
		value.bind( function( to ) {
			console.log( to )
			$('body #main-banner-section.banner-layout--five .main-banner-trailing-posts').removeClass( 'layout--row layout--column' ).addClass( 'layout--' + to )
		});
	});
	
	// archive page layout
	wp.customize( 'archive_page_layout', function( value ) {
		value.bind( function(to) {
			$('body').removeClass( 'post-layout--one post-layout--two post-layout--three post-layout--four post-layout--five' ).addClass( 'post-layout--' + to )
		});
	})
	
	// archive image ratio
	wp.customize( 'archive_page_image_ratio', function( value ) {
		value.bind( function( to ) {
			// console.log( (to.desktop * 100%) )
            var cssCode = ''
            var selector = 'main.site-main .primary-content article figure.post-thumb-wrap'
            if( to.desktop ) {
				cssCode += selector +' { padding-bottom: calc( '+ to.desktop +'* 100% ) }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { '+ selector +' { padding-bottom: calc(' + to.tablet + '* 100%) } }';
			}
			if( to.smartphone ) {				
				cssCode += '@media(max-width: 610px) { '+ selector +' { padding-bottom: calc(' + to.smartphone + '* 100%) } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-archive-page-image-ratio' )
		});
	});

	// archive image radius
	wp.customize( 'archive_page_image_border_radius', function( value ) {
		value.bind( function( to ) {
            var cssCode = ''
            var selector = 'main.site-main .primary-content article figure.post-thumb-wrap img'
            if( to.desktop ) {
				cssCode += selector +' { border-radius: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { '+ selector +' { border-radius: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {				
				cssCode += '@media(max-width: 610px) { '+ selector +' { border-radius: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-archive-page-image-radius' )
		});
	});

	// single post related articles title option
	wp.customize( 'single_post_related_posts_title', function( value ) {
		value.bind( function(to) {
			if( $( ".single-related-posts-section-wrap" ).find('.newsmatic-block-title span').length > 0 ) {
				$( ".single-related-posts-section-wrap" ).find('.newsmatic-block-title span').text( to )
			} else {
				$( ".single-related-posts-section-wrap .single-related-posts-section" ).prepend('<h2 class="newsmatic-block-title"><span>'+ to +'</span></h2>')
			}
		});
	});

	// bottom footer copyright gext
	wp.customize( 'bottom_footer_site_info', function( value ) {
		value.bind( function(to) {
			if( $('body footer .bottom-inner-wrapper .site-info').length > 0 ) {
				$('body footer .bottom-inner-wrapper .site-info').html( to )
			} else {
				$('body footer .bottom-inner-wrapper').append('<div class="site-info">'+ to +'</div>')
			}
		});
	})

	const ajaxFunctions = {
		typoFontsEnqueue: function() {
			var action = themeContstants.prefix + "typography_fonts_url",id ="newsmatic-customizer-typo-fonts-css"
			themeCalls.newsmaticGenerateLinkTag( action, id )
		}
	}

	// returns css property and value of background
	function newsmatic_get_background_style( control ) {
		if( control ) {
			var cssCode = '', mediaUrl = '', repeat = '', position = '', attachment = '', size = ''
			switch( control.type ) {
				case 'image' : 
						if( 'media_id' in control.image ) mediaUrl = 'background-image: url(' + control.image.media_url + ');'
						if( 'repeat' in control ) repeat = " background-repeat: "+ control.repeat + ';'
						if( 'position' in control ) position = " background-position: "+ control.position + ';'
						if( 'attachment' in control ) attachment = " background-attachment: "+ control.attachment + ';'
						if( 'size' in control ) size = " background-size: "+ control.size + ';'
						return cssCode.concat( mediaUrl, repeat, position, attachment, size )
					break;
				default: 
				if( 'type' in control ) return "background: " + helperFunctions.getFormatedColor( control[control.type] )
	   		}
		}
	}

    // constants
	const helperFunctions = {
		generateStyle: function(color, id, variable) {
			if(color) {
				if( id == 'theme-color-style' ) {
					var styleText = 'body.newsmatic_main_body, body.newsmatic_dark_mode { ' + variable + ': ' + helperFunctions.getFormatedColor(color) + '}';
				} else {
					var styleText = 'body.newsmatic_main_body { ' + variable + ': ' + helperFunctions.getFormatedColor(color) + '}';
				}
				if( $( "head #" + id ).length > 0 ) {
					$( "head #" + id).text( styleText )
				} else {
					$( "head" ).append( '<style id="' + id + '">' + styleText + '</style>' )
				}
			}
		},
		getFormatedColor: function(color) {
			if( color == null ) return
			if( color.includes('preset') ) {
				return 'var(' + color + ')'
			} else {
				return color
			}
		}
	}

	// main header width layout
	wp.customize( 'header_width_layout', function( value ) {
		value.bind( function( to ) {
			$('body').removeClass('header-width--contain header-width--full-width').addClass( 'header-width--' + to )
		})
	})

	// MARK: Builder Preview

	// header builder border
	wp.customize( 'header_builder_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-header.layout--default  { border: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-top-header-border-bottom' )
		});
	});

	// Header Builder Box Shadow
	wp.customize('header_builder_box_shadow', function( value ) {
		value.bind(function( to ) {
			var cssCode = '',
				selector = 'body .site .site-header'
			if( to && to.option !== 'none' ) {
				let boxShadowValue = `${ ( to.type === 'outset' ) ? '' : to.type } ${ to.hoffset }px ${ to.voffset }px ${ to.blur }px ${ to.spread }px ${ helperFunctions.getFormatedColor( to.color ) }`
				cssCode += `${ selector } { box-shadow: ${ boxShadowValue }; -webkit-box-shadow: ${ boxShadowValue }; -moz-box-shadow ${ boxShadowValue } }`
			} else {
				cssCode += `${ selector } { box-shadow: 0px 0px 0px 0px; }`
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-box-shadow' )
		})
	})

	// custom buttom background hover
	wp.customize( 'top_header_background_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = '.newsmatic_main_body .site-header .row-one.full-width, .newsmatic_main_body .site-header .row-one .full-width { background: '+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-custom-button-background-hover' )
		})
	})

	// Row Two header background
	wp.customize( 'header_background_color_group', function( value ) {
		value.bind( function(to) {
			var value = JSON.parse( to )
			if( value ) {
				var cssCode = ''
				cssCode += '.newsmatic_main_body .site-header .row-two.full-width, .newsmatic_main_body .site-header .row-two .full-width {' + newsmatic_get_background_style( value ) + '}'
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-background-color-group' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-background-color-group' )
			}
		});
	})

	// menu options border top
	wp.customize( 'header_menu_top_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-header .row-two .bb-bldr-row:before { border-bottom: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-menu-border-top' )
		});
	});

	// Header Row Three background
	wp.customize( 'header_menu_background_color_group', function( value ) {
		value.bind( function(to) {
			var value = JSON.parse( to )
			if( value ) {
				var cssCode = ''
				cssCode += '.newsmatic_main_body .site-header .row-three.full-width, .newsmatic_main_body .site-header .row-three .full-width {' + newsmatic_get_background_style( value ) + '}'
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-menu-background-color-group' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-menu-background-color-group' )
			}
		});
	})

	// Header Row Three border bottom
	wp.customize( 'header_menu_bottom_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-header .row-three .bb-bldr-row:before { border-bottom: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-menu-border-bottom' )
		});
	});

	wp.customize('header_first_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = '',
				{ desktop, tablet, smartphone } = to
			if( desktop ) {
				cssCode += `body .site-header .row-one.full-width, body .site-header .row-one .full-width { 
					padding: ${ desktop.top } ${ desktop.right } ${ desktop.bottom } ${ desktop.left };
				}
				body .bb-bldr--normal .custom-button-absolute { 
					bottom: -${ desktop.bottom }; 
				}`;
			}
			if( tablet ) {
				cssCode += `@media(max-width: 940px) { 
					body .site-header .row-one.full-width, body .site-header .row-one .full-width { 
						padding: ${ tablet.top } ${ tablet.right } ${ tablet.bottom } ${ tablet.left };
					} 
					body .bb-bldr--responsive .custom-button-absolute { 
						bottom: -${ tablet.bottom }; 
					}
				}`;
			}
			if( smartphone ) {
				cssCode += `@media(max-width: 610px) { 
					body .site-header .row-one.full-width, body .site-header .row-one .full-width { 
						padding: ${ smartphone.top } ${ smartphone.right } ${ smartphone.bottom } ${ smartphone.left } 
					} 
					body .bb-bldr--responsive .custom-button-absolute {
						bottom: -${ smartphone.bottom };
					}
				}`;
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-first-row-padding' )
		})
	})
	wp.customize('header_second_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = '',
				{ desktop, tablet, smartphone } = to
			if( desktop ) {
				cssCode += `body .site-header .row-two.full-width, body .site-header .row-two .full-width {
					padding: ${ desktop.top } ${ desktop.right } ${ desktop.bottom } ${ desktop.left } 
				}
				body .bb-bldr--normal .row-two .bb-bldr-row:before, body .bb-bldr--normal .custom-button-absolute {
					bottom: -${ desktop.bottom };
				}`;
			}
			if( tablet ) {
				cssCode += `@media(max-width: 940px) { 
					body .site-header .row-two.full-width, body .site-header .row-two .full-width { 
						padding: ${ tablet.top } ${ tablet.right } ${ tablet.bottom } ${ tablet.left } 
					}
					body .bb-bldr--responsive .row-two .bb-bldr-row:before, body .bb-bldr--responsive .custom-button-absolute {
						bottom: -${ tablet.bottom };
					}
				}`;
			}
			if( smartphone ) {
				cssCode += `@media(max-width: 610px) { 
					body .site-header .row-two.full-width, body .site-header .row-two .full-width { 
						padding: ${ smartphone.top } ${ smartphone.right } ${ smartphone.bottom } ${ smartphone.left };
					}
					body .bb-bldr--responsive .row-two .bb-bldr-row:before, body .bb-bldr--responsive .custom-button-absolute {
						bottom: -${ smartphone.bottom };
					}
				}`;
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-second-row-padding' )
		})
	})

	wp.customize('header_third_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = '',
				{ desktop, tablet, smartphone } = to
			if( desktop ) {
				cssCode += `body .site-header .row-three.full-width, body .site-header .row-three .full-width { 
					padding: ${ desktop.top } ${ desktop.right } ${ desktop.bottom } ${ desktop.left } 
				}
				body .bb-bldr--normal .row-three .bb-bldr-row:before, body .bb-bldr--normal .custom-button-absolute {
					bottom: -${ desktop.bottom };
				};
				`;
			}
			if( tablet ) {
				cssCode += `@media(max-width: 940px) { 
					body .site-header .row-three.full-width, body .site-header .row-three .full-width { 
						padding: ${ tablet.top } ${ tablet.right } ${ tablet.bottom } ${ tablet.left };
					}
					body .bb-bldr--responsive .row-three .bb-bldr-row:before, body .bb-bldr--responsive .custom-button-absolute {
						bottom: -${ tablet.bottom };
					}
				}`;
			}
			if( smartphone ) {
				cssCode += `@media(max-width: 610px) { 
					body .site-header .row-three.full-width, body .site-header .row-three .full-width {
						padding: ${ smartphone.top } ${ smartphone.right } ${ smartphone.bottom } ${ smartphone.left }; 
					}
					body .bb-bldr--responsive .row-three .bb-bldr-row:before, body .bb-bldr--responsive .custom-button-absolute {
						bottom: -${ smartphone.bottom };
					}
				}`;
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-third-row-padding' )
		})
	})
	wp.customize('footer_first_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = ''
			if( to.desktop ) {
				var desktop = to.desktop
				cssCode += 'body .site-footer .row-one.full-width, body .site-footer .row-one .full-width { padding: ' + desktop.top + ' ' + desktop.right + ' ' + desktop.bottom + ' ' + desktop.left + ' }';
			}
			if( to.tablet ) {
				var tablet = to.tablet
				cssCode += '@media(max-width: 940px) { body .site-footer .row-one.full-width, body .site-footer .row-one .full-width { padding: ' + tablet.top + ' ' + tablet.right + ' ' + tablet.bottom + ' ' + tablet.left + ' } }';
			}
			if( to.smartphone ) {
				var smartphone = to.smartphone
				cssCode += '@media(max-width: 610px) { body .site-footer .row-one.full-width, body .site-footer .row-one .full-width { padding: ' + smartphone.top + ' ' + smartphone.right + ' ' + smartphone.bottom + ' ' + smartphone.left + ' } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-footer-first-row-padding' )
		})
	})

	wp.customize('footer_second_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = ''
			if( to.desktop ) {
				var desktop = to.desktop
				cssCode += 'body .site-footer .row-two.full-width, body .site-footer .row-two .full-width { padding: ' + desktop.top + ' ' + desktop.right + ' ' + desktop.bottom + ' ' + desktop.left + ' }';
			}
			if( to.tablet ) {
				var tablet = to.tablet
				cssCode += '@media(max-width: 940px) { body .site-footer .row-two.full-width, body .site-footer .row-two .full-width { padding: ' + tablet.top + ' ' + tablet.right + ' ' + tablet.bottom + ' ' + tablet.left + ' } }';
			}
			if( to.smartphone ) {
				var smartphone = to.smartphone
				cssCode += '@media(max-width: 610px) { body .site-footer .row-two.full-width, body .site-footer .row-two .full-width { padding: ' + smartphone.top + ' ' + smartphone.right + ' ' + smartphone.bottom + ' ' + smartphone.left + ' } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-footer-second-row-padding' )
		})
	})
	wp.customize('footer_third_row_padding', function( value ) {
		value.bind(function( to ){
			var cssCode = ''
			if( to.desktop ) {
				var desktop = to.desktop
				cssCode += 'body .site-footer .row-three.full-width, body .site-footer .row-three .full-width { padding: ' + desktop.top + ' ' + desktop.right + ' ' + desktop.bottom + ' ' + desktop.left + ' }';
			}
			if( to.tablet ) {
				var tablet = to.tablet
				cssCode += '@media(max-width: 940px) { body .site-footer .row-three.full-width, body .site-footer .row-three .full-width { padding: ' + tablet.top + ' ' + tablet.right + ' ' + tablet.bottom + ' ' + tablet.left + ' } }';
			}
			if( to.smartphone ) {
				var smartphone = to.smartphone
				cssCode += '@media(max-width: 610px) { body .site-footer .row-three.full-width, body .site-footer .row-three .full-width { padding: ' + smartphone.top + ' ' + smartphone.right + ' ' + smartphone.bottom + ' ' + smartphone.left + ' } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-footer-third-row-padding' )
		})
	})

	wp.customize( 'top_header_bottom_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-header .row-one.full-width, body .site-header .row-one .full-width  { border-bottom: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-top-header-bottom-border' )
		});
	});

	wp.customize( 'footer_third_row_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-footer .row-three.full-width, body .site-footer .row-three .full-width { border-top: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-footer-third-row-border' )
		});
	});

	wp.customize( 'footer_second_row_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-footer .row-two.full-width, body .site-footer .row-two .full-width { border-top: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-footer-second-row-border' )
		});
	});

	// first row background color
	wp.customize( 'top_header_background_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			themeCalls.newsmaticGenerateStyleTag( '.newsmatic_main_body .site-header .row-one.full-width, .newsmatic_main_body .site-header .row-one .full-width { background : ' + color + ' }', 'newsmatic-top-header-background-color' )
		})
	})

	// Row Two header background
	wp.customize( 'header_background_color_group', function( value ) {
		value.bind( function(to) {
			var value = JSON.parse( to )
			if( value ) {
				var cssCode = ''
				cssCode += '.newsmatic_main_body .site-header .row-two.full-width, .newsmatic_main_body .site-header .row-two .full-width {' + newsmatic_get_background_style( value ) + '}'
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-background-color-group' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-header-background-color-group' )
			}
		});
	})

	wp.customize( 'custom_button_make_absolute', function( value ) {
		value.bind( function( to ) {
			let customButton = $( '.site-header .header-custom-button' ),
				parent = customButton.parent()
			if( to ) {
				parent.addClass( 'custom-button-absolute' );
			} else {
				parent.removeClass( 'custom-button-absolute' );
			}
		});
	});

	wp.customize( 'off_canvas_position', function( value ) {
		value.bind( function( to ) {
			let offCanvas = $( '.site-header .sidebar-toggle-wrap' )
			offCanvas.removeClass( 'position--left position--right' ).addClass( `position--${ to }` )
		});
	});

	wp.customize( 'off_canvas_width', function( value ) {
		value.bind( function( to ) {
			let offCanvas = $( '.site-header .sidebar-toggle-wrap' )
		});
	});

	wp.customize( 'secondary_menu_hover_effect', function( value ) {
		value.bind( function( to ) {
			let secondaryMenu = $( '.site-header .top-nav-menu' )
			secondaryMenu.removeClass( 'hover-effect--none hover-effect--one' ).addClass( `hover-effect--${ to }` )
		});
	});

	wp.customize( 'header_first_row_header_sticky', function( value ) {
		value.bind( function( to ) {
			let rowOne = $( '.site-header .row-wrap.row-one' )
			rowOne.toggleClass( 'row-sticky' )
		});
	});

	wp.customize( 'header_second_row_header_sticky', function( value ) {
		value.bind( function( to ) {
			let rowTwo = $( '.site-header .row-wrap.row-two' )
			rowTwo.toggleClass( 'row-sticky' )
		});
	});

	wp.customize( 'header_third_row_header_sticky', function( value ) {
		value.bind( function( to ) {
			let rowThree = $( '.site-header .row-wrap.row-three' )
			rowThree.toggleClass( 'row-sticky' )
		});
	});

	wp.customize( 'header_first_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-header .row-wrap.row-one' ),
				innerElement = $( '.site-header .row-wrap.row-one .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	wp.customize( 'header_second_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-header .row-wrap.row-two' ),
				innerElement = $( '.site-header .row-wrap.row-two .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	wp.customize( 'header_third_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-header .row-wrap.row-three' ),
				innerElement = $( '.site-header .row-wrap.row-three .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	wp.customize( 'footer_first_row_row_direction', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-one .bb-bldr-row' ).toggleClass( 'is-vertical is-horizontal' )
		});
	});

	wp.customize( 'footer_second_row_row_direction', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-two .bb-bldr-row' ).toggleClass( 'is-vertical is-horizontal' )
		});
	});

	wp.customize( 'footer_third_row_row_direction', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-three .bb-bldr-row' ).toggleClass( 'is-vertical is-horizontal' )
		});
	});

	wp.customize( 'footer_first_row_vertical_alignment', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-one .bb-bldr-row' ).removeClass( 'vertical-align--top vertical-align--center vertical-align--bottom' ).addClass( `vertical-align--${ to }` )
		});
	});

	wp.customize( 'footer_second_row_vertical_alignment', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-two .bb-bldr-row' ).removeClass( 'vertical-align--top vertical-align--center vertical-align--bottom' ).addClass( `vertical-align--${ to }` )
		});
	});

	wp.customize( 'footer_third_row_vertical_alignment', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer .row-wrap.row-three .bb-bldr-row' ).removeClass( 'vertical-align--top vertical-align--center vertical-align--bottom' ).addClass( `vertical-align--${ to }` )
		});
	});

	wp.customize( 'footer_first_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-footer .row-wrap.row-one' ),
				innerElement = $( '.site-footer .row-wrap.row-one .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	wp.customize( 'footer_second_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-footer .row-wrap.row-two' ),
				innerElement = $( '.site-footer .row-wrap.row-two .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	wp.customize( 'footer_third_row_full_width', function( value ) {
		value.bind( function( to ) {
			let element = $( '.site-footer .row-wrap.row-three' ),
				innerElement = $( '.site-footer .row-wrap.row-three .bb-bldr-row' )
			if( to ) {
				element.addClass( 'full-width' )
				innerElement.removeClass( 'full-width' )
			} else {
				element.removeClass( 'full-width' )
				innerElement.addClass( 'full-width' )
			}
		});
	});

	// Header column alignments
	const headerColumnAlignments = {
		'one': {
			'one': 'header_first_row_column_one',
			'two': 'header_first_row_column_two',
			'three': 'header_first_row_column_three',
			'four': 'header_first_row_column_four'
		},
		'two': {
			'one': 'header_second_row_column_one',
			'two': 'header_second_row_column_two',
			'three': 'header_second_row_column_three',
			'four': 'header_second_row_column_four'
		},
		'three': {
			'one': 'header_third_row_column_one',
			'two': 'header_third_row_column_two',
			'three': 'header_third_row_column_three',
			'four': 'header_third_row_column_four'
		}
	}
	Object.entries( headerColumnAlignments ).map(( [ row, columns ] ) => {
		Object.entries( columns ).map(( [ column, controlId ] ) => {
			wp.customize( controlId, function( value ) {
				value.bind( function( to ) {
					let element = $( `.site-header .row-wrap.row-${ row } .bb-bldr-column.${ column }` ),
						{ desktop, tablet, smartphone } = to
		
					element.removeClass( 'alignment-left alignment-right alignment-center tablet-alignment--left tablet-alignment--center tablet-alignment--right smartphone-alignment--center smartphone-alignment--left smartphone-alignment--right' ).addClass( `alignment-${ desktop } tablet-alignment--${ tablet } smartphone-alignment--${ smartphone }` )
				});
			});
		})
	})

	// Footer column alignments
	const footerColumnAlignments = {
		'one': {
			'one': 'footer_first_row_column_one',
			'two': 'footer_first_row_column_two',
			'three': 'footer_first_row_column_three',
			'four': 'footer_first_row_column_four'
		},
		'two': {
			'one': 'footer_second_row_column_one',
			'two': 'footer_second_row_column_two',
			'three': 'footer_second_row_column_three',
			'four': 'footer_second_row_column_four'
		},
		'three': {
			'one': 'footer_third_row_column_one',
			'two': 'footer_third_row_column_two',
			'three': 'footer_third_row_column_three',
			'four': 'footer_third_row_column_four'
		}
	}
	Object.entries( footerColumnAlignments ).map(( [ row, columns ] ) => {
		Object.entries( columns ).map(( [ column, controlId ] ) => {
			wp.customize( controlId, function( value ) {
				value.bind( function( to ) {
					let element = $( `.site-footer .row-wrap.row-${ row } .bb-bldr-column.${ column }` ),
						{ desktop, tablet, smartphone } = to
		
					element.removeClass( 'alignment-left alignment-right alignment-center tablet-alignment--left tablet-alignment--center tablet-alignment--right smartphone-alignment--center smartphone-alignment--left smartphone-alignment--right' ).addClass( `alignment-${ desktop } tablet-alignment--${ tablet } smartphone-alignment--${ smartphone }` )
				});
			});
		})
	})

	// footer menu hover effect
	wp.customize( 'footer_menu_hover_effect', function( value ) {
		value.bind( function( to ) {
			let secondaryMenu = $( '.site-footer .bottom-menu' )
			secondaryMenu.removeClass( 'hover-effect--none hover-effect--one' ).addClass( `hover-effect--${ to }` )
		});
	});

	// bottom footer logo width
	wp.customize( 'bottom_footer_logo_width', function( value ) {
		value.bind( function( to ) {
			var cssCode = ''
			if( to.desktop ) {
				cssCode += 'body .site-footer .footer-site-logo img { width: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { body .site-footer .footer-site-logo img { width: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {
				cssCode += '@media(max-width: 610px) { body .site-footer .footer-site-logo img { width: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-site-logo-width' )
		})
	});

	// off canvas width
	wp.customize( 'off_canvas_width', function( value ) {
		value.bind( function( to ) {
			var cssCode = ''
			if( to.desktop ) {
				cssCode += 'body .sidebar-toggle { width: ' + to.desktop + 'px }';
			}
			if( to.tablet ) {
				cssCode += '@media(max-width: 940px) { body .sidebar-toggle { width: ' + to.tablet + 'px } }';
			}
			if( to.smartphone ) {
				cssCode += '@media(max-width: 610px) { body .sidebar-toggle { width: ' + to.smartphone + 'px } }';
			}
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-site-logo-width' )
		})
	});

	// main header Theme Light Mode color
	wp.customize('light_mode_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--mode-toggle-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-header-light-mode-icon-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-main-header-light-mode-icon-color' )
			}
		})
	})

	// main header Theme Light Mode color
	wp.customize('dark_mode_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--mode-toggle-color-dark'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-main-header-dark-mode-icon-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-main-header-dark-mode-icon-color' )
			}
		})
	})

	// top footer social icon color
	wp.customize('footer_social_icons_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--footer-social-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-top-footer-social-icon-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-top-footer-social-icon-color' )
			}
		})
	})

	// top header menu color
	wp.customize('top_header_menu_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--top-header-menu-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-top-header-menu-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-top-header-menu-color' )
			}
		})
	})

	// date time display block
	wp.customize( 'date_time_display_block', function( value ) {
		value.bind( function( to ) {
			let element = $( '.top-date-time' )		
			if( to ) {
				element.addClass( 'is-display-block' )
			} else {
				element.removeClass( 'is-display-block' )
			}
		});
	});

	// top header date / time color
	wp.customize( 'top_header_datetime_color', function( value ) {
		value.bind( function( to ) {
			var color = helperFunctions.getFormatedColor( to )
			themeCalls.newsmaticGenerateStyleTag( 'body.newsmatic_main_body .site-header.layout--default .top-date-time, body.newsmatic_main_body .site-header.layout--default .top-date-time:after { color : ' + color + ' }', 'newsmatic-top-header-datatime-color' )
		})
	})

	// random news label color
	wp.customize('header_random_news_label_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--random-news-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-random-news-label-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-random-news-label-color' )
			}
		})
	})

	// newsletter label color
	wp.customize('header_newsletter_label_color', function( value ) {
		value.bind(function( to ){
			if( to ) {
				var cssCode = ''
				var selector = '--newsletter-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-newsletter-label-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-newsletter-label-color' )
			}
		})
	})

	// theme footer width option
	wp.customize( 'footer_section_width', function( value ) {
		value.bind( function( to ) {
			$( '.site-footer' ).removeClass( 'boxed-width full-width' ).addClass( to )
		});
	});

	// theme footer text color
	wp.customize( 'footer_color', function( value ) {
		value.bind( function( to ) {
			var color = helperFunctions.getFormatedColor( to.color )
			var hover = helperFunctions.getFormatedColor( to.hover )
			themeCalls.newsmaticGenerateStyleTag( 'body.newsmatic_font_typography { --footer-text-color : ' + color + '; --footer-text-color-hover : ' + hover + ' }', 'newsmatic-theme-footer-text-color' )
		})
	})

	// theme footer background setting
	wp.customize( 'footer_background_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = 'body.newsmatic_main_body .site-footer .row-one.full-width, body.newsmatic_main_body .site-footer .row-one .full-width { background:'+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-row-one-footer-background-color' )
		})
	})

	// theme footer border top
	wp.customize( 'footer_top_border', function( value ) {
		value.bind( function( to ) {
			var cssCode = 'body .site-footer .row-one.full-width, body .site-footer .row-one .full-width { border-top: '+ to.width +'px '+ to.type +' '+ helperFunctions.getFormatedColor( to.color ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-theme-footer-border-top' )
		});
	});

	// Row Two footer background color
	wp.customize( 'bottom_footer_background_color_group', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = 'body.newsmatic_main_body .site-footer .row-two.full-width, body.newsmatic_main_body .site-footer .row-two .full-width { background:'+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-bottom-footer-background-color' )
		})
	})

	// Row Three footer background color
	wp.customize( 'footer_third_row_background', function( value ) {
		value.bind( function( to ) {
			var value = JSON.parse( to )
			var color = helperFunctions.getFormatedColor( value[value.type] )
			var cssCode = 'body.newsmatic_main_body .site-footer .row-three.full-width, body.newsmatic_main_body .site-footer .row-three .full-width { background:'+ color +' }'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-row-three-footer-background-color' )
		})
	})

	// bottom footer text color
	wp.customize( 'bottom_footer_text_color', function( value ) {
		value.bind( function( to ) {
			var cssCode = '.newsmatic_main_body .site-footer .site-info { color: '+ helperFunctions.getFormatedColor( to ) +'}'
			themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-bottom-footer-text-color' )
		});
	});

	// top header social icon color
	wp.customize('top_header_social_icon_color', function( value ) {
		value.bind(function( to ){	
			if( to ) {
				var cssCode = ''
				var selector = '--top-header-social-color'
				if( to.color ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + ' : ' + helperFunctions.getFormatedColor( to.color ) +  ' } '
				}
				if( to.hover ) {
					cssCode += 'body.newsmatic_font_typography { ' + selector + '-hover : ' + helperFunctions.getFormatedColor( to.hover ) +  ' } '
				}
				themeCalls.newsmaticGenerateStyleTag( cssCode, 'newsmatic-top-header-social-icon-color' )
			} else {
				themeCalls.newsmaticGenerateStyleTag( '', 'newsmatic-top-header-social-icon-color' )
			}
		})
	})
} ( jQuery ) )