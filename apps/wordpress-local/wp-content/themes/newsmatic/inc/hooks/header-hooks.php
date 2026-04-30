<?php
/**
 * Header hooks and functions
 * 
 * @package Newsmatic
 * @since 1.0.0
 */
use Newsmatic\CustomizerDefault as ND;
if( ! function_exists( 'newsmatic_main_header_social_part' ) ) :
    /**
     * Main header social element
     * 
     * @since 1.0.0
     */
    function newsmatic_main_header_social_part() {
        ?>
            <div class="social-icons-wrap">
                <?php newsmatic_customizer_social_icons(); ?>
            </div>
        <?php
    }
    add_action( 'newsmatic_header_social_icons_hook', 'newsmatic_main_header_social_part' );
 endif;

 if( ! function_exists( 'newsmatic_header_site_branding_part' ) ) :
    /**
     * Header site branding element
     * 
     * @since 1.0.0
     */
     function newsmatic_header_site_branding_part() {
         ?>
            <div class="site-branding">
                <?php
                    the_custom_logo();

                    if ( is_front_page() || is_home() ) :
                ?>
                        <h1 class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></h1>
                <?php
                    else :
                ?>
                        <p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
                <?php
                    endif;
                    $newsmatic_description = get_bloginfo( 'description', 'display' );
                    if ( $newsmatic_description || is_customize_preview() ) :
                ?>
                    <p class="site-description"><?php echo $newsmatic_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></p>
                <?php endif; ?>
            </div><!-- .site-branding -->
         <?php
     }
    add_action( 'newsmatic_site_branding_hook', 'newsmatic_header_site_branding_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_ads_banner_part' ) ) :
    /**
     * Header ads banner element
     * 
     * @since 1.0.0
     */
    function newsmatic_header_ads_banner_part() {
        if( ! ND\newsmatic_get_multiselect_tab_option( 'header_ads_banner_responsive_option' ) ) return;
            $header_ads_banner_custom_image = ND\newsmatic_get_customizer_option( 'header_ads_banner_custom_image' );
            $header_ads_banner_custom_url = ND\newsmatic_get_customizer_option( 'header_ads_banner_custom_url' );
            $header_ads_banner_custom_target = ND\newsmatic_get_customizer_option( 'header_ads_banner_custom_target' );
            if( ! empty( $header_ads_banner_custom_image ) ) :
            ?>
                <div class="ads-banner">
                    <a href="<?php echo esc_url( $header_ads_banner_custom_url ); ?>" target="<?php echo esc_html( $header_ads_banner_custom_target ); ?>"><img src="<?php echo esc_url( wp_get_attachment_url( $header_ads_banner_custom_image ) ); ?>"></a>
                </div><!-- .ads-banner -->
            <?php
            endif;
    }
    if( ND\newsmatic_get_customizer_option( 'use_ad_outside_of_header' ) ) :
        add_action( 'newsmatic_after_header_hook', 'newsmatic_header_ads_banner_part', 10 );
    else:
        add_action( 'newsmatic_header_ads_banner_hook', 'newsmatic_header_ads_banner_part', 10 );
    endif;
 endif;

 if( ! function_exists( 'newsmatic_header_newsletter_part' ) ) :
    /**
     * Header newsletter element
     * 
     * @since 1.0.0
     */
    function newsmatic_header_newsletter_part() {
        $header_newsletter_label = ND\newsmatic_get_customizer_option( 'header_newsletter_label' );
        $header_newsletter_redirect_href_link = ND\newsmatic_get_customizer_option( 'header_newsletter_redirect_href_link' );
        ?>
            <div class="newsletter-element">
                <a href="<?php echo esc_url( $header_newsletter_redirect_href_link ); ?>" target="_blank" data-popup="redirect">
                    <?php
                        if( isset($header_newsletter_label['icon']) && !empty($header_newsletter_label['icon']) ) echo '<span class="title-icon"><i class="' .esc_attr($header_newsletter_label['icon']). '"></i></span>';
                        if( isset($header_newsletter_label['text']) && !empty(isset($header_newsletter_label['text'])) ) echo '<span class="title-text">' .esc_html($header_newsletter_label['text']). '</span>';
                    ?>
                </a>
            </div><!-- .newsletter-element -->
        <?php
    }
    add_action( 'newsmatic_newsletter_hook', 'newsmatic_header_newsletter_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_random_news_part' ) ) :
    /**
     * Header random news element
     * 
     * @since 1.0.0
     */
    function newsmatic_header_random_news_part() {
        if( ! ND\newsmatic_get_customizer_option( 'header_random_news_option' ) ) return;
        $header_random_news_label = ND\newsmatic_get_customizer_option( 'header_random_news_label' );
        $header_random_news_filter = ND\newsmatic_get_customizer_option( 'header_random_news_filter' );
        ?>
            <div class="random-news-element">
                <a href="<?php echo esc_url( add_query_arg( array( 'newsmaticargs' => 'custom', 'posts'  => esc_attr( $header_random_news_filter ) ), home_url() ) ); ?>">
                    <?php
                        if( isset($header_random_news_label['icon']) && !empty($header_random_news_label['icon']) ) echo '<span class="title-icon"><i class="' .esc_attr($header_random_news_label['icon']). '"></i></span>';
                        if( isset($header_random_news_label['text']) && !empty($header_random_news_label['text'])   ) echo '<span class="title-text">' .esc_html($header_random_news_label['text']). '</span>';
                    ?>
                </a>
            </div><!-- .random-news-element -->
        <?php
    }
    add_action( 'newsmatic_random_news_hook', 'newsmatic_header_random_news_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_sidebar_toggle_part' ) ) :
    /**
     * Header sidebar toggle element
     * 
     * @since 1.0.0
     */
    function newsmatic_header_sidebar_toggle_part() {
        $off_canvas_position = ND\newsmatic_get_customizer_option( 'off_canvas_position' );
        $off_canvas_class = 'sidebar-toggle-wrap';
        if( $off_canvas_position ) $off_canvas_class .= ' position--' . $off_canvas_position;
        ?>
            <div class="<?php echo esc_attr( $off_canvas_class ); ?>">
                <a class="sidebar-toggle-trigger" href="javascript:void(0);">
                    <div class="newsmatic_sidetoggle_menu_burger">
                      <span></span>
                      <span></span>
                      <span></span>
                  </div>
                </a>
                <div class="sidebar-toggle hide">
                    <span class="sidebar-toggle-close"><i class="fas fa-times"></i></span>
                    <div class="newsmatic-container">
                        <div class="row">
                            <?php dynamic_sidebar( 'header-toggle-sidebar' ); ?>
                        </div>
                    </div>
                </div>
            </div>
        <?php
    }
    add_action( 'newsmatic_off_canvas_hook', 'newsmatic_header_sidebar_toggle_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_menu_part' ) ) :
    /**
     * Header menu element
     * 
     * @since 1.0.0
     */
    function newsmatic_header_menu_part() {
        ?>
            <nav id="site-navigation" class="main-navigation <?php echo esc_attr( 'hover-effect--' . ND\newsmatic_get_customizer_option( 'header_menu_hover_effect' ) ); ?>">
                <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                    <div id="newsmatic_menu_burger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span class="menu_txt"><?php esc_html_e( 'Menu', 'newsmatic' ); ?></span></button>
                <?php
                    wp_nav_menu([
                        'theme_location' => 'menu-2',
                        'menu_id'        => 'header-menu',
                    ]);
                ?>
            </nav><!-- #site-navigation -->
        <?php
    }
    add_action( 'newsmatic_primary_menu_hook', 'newsmatic_header_menu_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_search_part' ) ) :
   /**
    * Header search element
    * 
    * @since 1.0.0
    */
    function newsmatic_header_search_part() {
        ?>
            <div class="search-wrap">
                <button class="search-trigger">
                    <i class="fas fa-search"></i>
                </button>
                <div class="search-form-wrap hide">
                    <?php echo get_search_form(); ?>
                </div>
            </div>
        <?php
    }
   add_action( 'newsmatic_header_search_hook', 'newsmatic_header_search_part', 10 );
endif;

if( ! function_exists( 'newsmatic_header_theme_mode_icon_part' ) ) :
    /**
     * Header theme mode element
     * 
     * @since 1.0.0
     */
     function newsmatic_header_theme_mode_icon_part() {
        $newsmatic_dark_mode = ( ND\newsmatic_get_customizer_option( 'theme_default_mode' ) == 'dark' || ( isset( $_COOKIE['themeMode'] ) && $_COOKIE['themeMode'] == 'dark' ) );
        ?>
            <div class="mode_toggle_wrap">
                <input class="mode_toggle" type="checkbox" <?php if( $newsmatic_dark_mode ) echo "checked"; ?>>
            </div>
        <?php
     }
    add_action( 'newsmatic_theme_mode_hook', 'newsmatic_header_theme_mode_icon_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_header_custom_button_part' ) ) :
    /**
     * Header theme mode element
     * 
     * @since 1.0.0
     */
     function newsmatic_header_custom_button_part() {
        $header_custom_button_redirect_href_link = ND\newsmatic_get_customizer_option( 'header_custom_button_redirect_href_link' );
        $header_custom_button_label = ND\newsmatic_get_customizer_option( 'header_custom_button_label' );
        ?>
            <a class="header-custom-button" href="<?php echo esc_url($header_custom_button_redirect_href_link); ?>" target="_blank">
                <?php if( $header_custom_button_label['icon'] != "fas fa-ban" ) : ?>
                    <span class="icon">
                        <i class="<?php echo esc_attr($header_custom_button_label['icon']); ?>"></i>
                    </span>
                <?php endif;
                if( $header_custom_button_label['text'] ) :
                ?>
                    <span class="ticker_label_title_string"><?php echo esc_html( $header_custom_button_label['text'] ); ?></span>
                <?php endif; ?>
            </a>
        <?php
    }
    add_action( 'newsmatic_custom_button_hook', 'newsmatic_header_custom_button_part', 10 );
 endif;

 if( ! function_exists( 'newsmatic_top_header_ticker_news_part' ) ) :
    /**
     * Top header ticker news element
     * 
     * @since 1.0.0
     */
    function newsmatic_top_header_ticker_news_part() {
      $top_header_ticker_news_post_filter = ND\newsmatic_get_customizer_option( 'top_header_ticker_news_post_filter' );
      if( $top_header_ticker_news_post_filter == 'category' ) {
            $ticker_args['posts_per_page'] = 4;
            $top_header_ticker_news_categories = json_decode( ND\newsmatic_get_customizer_option( 'top_header_ticker_news_categories' ) );
            if( ND\newsmatic_get_customizer_option( 'top_header_ticker_news_date_filter' ) != 'all' ) $ticker_args['date_query'] = newsmatic_get_date_format_array_args(ND\newsmatic_get_customizer_option( 'top_header_ticker_news_date_filter' ));
            if( $top_header_ticker_news_categories ) $ticker_args['category_name'] = newsmatic_get_categories_for_args($top_header_ticker_news_categories);
      } else if( $top_header_ticker_news_post_filter == 'title' ) {
            $top_header_ticker_news_posts = json_decode(ND\newsmatic_get_customizer_option( 'top_header_ticker_news_posts' ));
            if( $top_header_ticker_news_posts ) {
               $ticker_args['post_name__in'] = newsmatic_get_post_slugs_for_args($top_header_ticker_news_posts);
            }
      }
      ?>
         <div class="top-ticker-news">
            <ul class="ticker-item-wrap">
               <?php
               if( isset( $ticker_args ) ) :
                     $ticker_args['ignore_sticky_posts'] = true;
                     $ticker_args = apply_filters( 'newsmatic_query_args_filter', $ticker_args );
                     $ticker_query = new WP_Query( $ticker_args );
                     if( $ticker_query->have_posts() ) :
                        while( $ticker_query->have_posts() ) : $ticker_query->the_post();
                        ?>
                           <li class="ticker-item"><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>"><?php the_title(); ?></a></h2></li>
                        <?php
                        endwhile;
                        wp_reset_postdata();
                     endif;
                  endif;
               ?>
            </ul>
			</div>
      <?php
    }
    add_action( 'newsmatic_header_ticker_news_hook', 'newsmatic_top_header_ticker_news_part', 10 );
 endif;

if( ! function_exists( 'newsmatic_top_header_date_time_part' ) ) :
    /**
     * Top header menu element
     * 
    * @since 1.0.0
    */
    function newsmatic_top_header_date_time_part() {
        $show_date = ND\newsmatic_get_customizer_option( 'date_option' );
        $show_time = ND\newsmatic_get_customizer_option( 'time_option' );
        if( ! $show_time && ! $show_date ) return;
        $display_block = ND\newsmatic_get_customizer_option( 'date_time_display_block' );
        $date_time_class = 'top-date-time';
        if( $display_block ) $date_time_class .= ' is-display-block';
        ?>
            <div class="<?php echo esc_attr( $date_time_class ); ?>">
                <?php
                    if( $show_date ) echo '<span class="date">', date_i18n( 'l, ' . get_option( 'date_format' ), current_time( 'timestamp' )) ,'</span>';
                    if( $show_time ) echo '<span class="time"></span>';
                ?>
            </div>
        <?php
    }
    add_action( 'newsmatic_date_time_hook', 'newsmatic_top_header_date_time_part', 10 );
endif;

if( ! function_exists( 'newsmatic_top_header_menu_part' ) ) :
   /**
    * Top header menu element
    * 
    * @since 1.0.0
    */
   function newsmatic_top_header_menu_part() {
    $secondary_menu_hover_effect = ND\newsmatic_get_customizer_option( 'secondary_menu_hover_effect' );
    $element_class = 'top-nav-menu';
    if( $secondary_menu_hover_effect !== 'none' ) $element_class .= ' hover-effect--' . $secondary_menu_hover_effect;
        ?>
            <div class="<?php echo esc_attr( $element_class ); ?>">
                <?php
                    wp_nav_menu([
                        'theme_location'    =>  'menu-1',
                        'menu_id'   =>  'top-menu',
                        'depth' =>  1
                    ]);
                ?>
            </div>
        <?php
    }
   add_action( 'newsmatic_secondary_menu_hook', 'newsmatic_top_header_menu_part', 10 );
endif;
 
 if( ! function_exists( 'newsmatic_ticker_news_part' ) ) :
    /**
     * Ticker news element
     * 
     * @since 1.0.0
     */
     function newsmatic_ticker_news_part() {
        $ticker_news_visible = ND\newsmatic_get_customizer_option( 'ticker_news_visible' );
        if( $ticker_news_visible === 'none' ) return;
        if( $ticker_news_visible === 'front-page' && ! is_front_page() ) {
            return;
        } else if( $ticker_news_visible === 'innerpages' && is_front_page()  ) {
            return;
        }
        $ticker_news_order_by = 'date-desc';
        $ticker_news_post_filter = ND\newsmatic_get_customizer_option( 'ticker_news_post_filter' );
        $orderArray = explode( '-', $ticker_news_order_by );
        $ticker_args = array(
            'order' => esc_html( $orderArray[1] ),
            'orderby' => esc_html( $orderArray[0] )
        );
        if( $ticker_news_post_filter == 'category' ) {
            $ticker_args['posts_per_page'] = 10;
            $ticker_news_categories = json_decode( ND\newsmatic_get_customizer_option( 'ticker_news_categories' ) );
            if( ND\newsmatic_get_customizer_option( 'ticker_news_date_filter' ) != 'all' ) $ticker_args['date_query'] = newsmatic_get_date_format_array_args(ND\newsmatic_get_customizer_option( 'ticker_news_date_filter' ));
            if( $ticker_news_categories ) $ticker_args['category_name'] = newsmatic_get_categories_for_args($ticker_news_categories);
        } else if( $ticker_news_post_filter == 'title' ) {
            $ticker_news_posts = json_decode(ND\newsmatic_get_customizer_option( 'ticker_news_posts' ));
            if( $ticker_news_posts ) $ticker_args['post_name__in'] = newsmatic_get_post_slugs_for_args($ticker_news_posts);
        }
         ?>
            <div class="ticker-news-wrap newsmatic-ticker layout--two" data-speed="15000">
                <?php
                    $ticker_news_title = ND\newsmatic_get_customizer_option( 'ticker_news_title' );
                    if( $ticker_news_title ) {
                        ?>
                        <div class="ticker_label_title ticker-title newsmatic-ticker-label">
                            <?php if( $ticker_news_title['icon'] != "fas fa-ban" ) : ?>
                                <span class="icon">
                                    <i class="<?php echo esc_attr($ticker_news_title['icon']); ?>"></i>
                                </span>
                            <?php endif;
                                if( $ticker_news_title['text'] ) :
                             ?>
                                    <span class="ticker_label_title_string"><?php echo esc_html( $ticker_news_title['text'] ); ?></span>
                                <?php endif; ?>
                        </div>
                        <?php
                    }
                ?>
                <div class="newsmatic-ticker-box">
                  <?php
                    $newsmatic_direction = 'left';
                    $newsmatic_dir = 'ltr';
                    if( is_rtl() ){
                      $newsmatic_direction = 'right';
                      $newsmatic_dir = 'ltr';
                    }
                  ?>

                    <ul class="ticker-item-wrap" direction="<?php echo esc_attr($newsmatic_direction); ?>" dir="<?php echo esc_attr($newsmatic_dir); ?>">
                        <?php get_template_part( 'template-parts/ticker-news/template', 'two', $ticker_args ); ?>
                    </ul>
                </div>
                <div class="newsmatic-ticker-controls">
                    <button class="newsmatic-ticker-pause"><i class="fas fa-pause"></i></button>
                </div>
            </div>
         <?php
     }
    add_action( 'newsmatic_after_header_hook', 'newsmatic_ticker_news_part', 10 );
 endif;
 
 if( ! function_exists( 'newsmatic_get_toggle_button_html' ) ) :
    /**
     * Mark: Toggle Button
     * 
     * @since 1.0.0
     */
    function newsmatic_get_toggle_button_html() {
        ?>
            <div class="toggle-button-wrapper">
                <span></span>
                <span></span>
                <span></span>
            </div>
        <?php
    }
endif;