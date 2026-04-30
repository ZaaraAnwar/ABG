<?php
/**
 * Footer hooks and functions
 * 
 * @package Newsmatic
 * @since 1.0.0
 */
use Newsmatic\CustomizerDefault as ND;

if( ! function_exists( 'newsmatic_bottom_footer_copyright_part' ) ) :
   /**
    * Bottom Footer copyright element
    * 
    * @since 1.0.0
    */
    function newsmatic_bottom_footer_copyright_part() {
      $bottom_footer_site_info = ND\newsmatic_get_customizer_option( 'bottom_footer_site_info' );
      if( ! $bottom_footer_site_info ) return;
     ?>
        <div class="site-info">
            <?php echo wp_kses_post( str_replace( '%year%', date('Y'), $bottom_footer_site_info ) ); ?>
				<?php echo sprintf( esc_html__( 'Powered By %s.', 'newsmatic' ), '<a href="https://blazethemes.com/">' .esc_html__( 'BlazeThemes', 'newsmatic' ). '</a>'  ); ?>
        </div>
     <?php
   }
   add_action( 'newsmatic_copyright_hook', 'newsmatic_bottom_footer_copyright_part', 10 );
endif;

if( ! function_exists( 'newsmatic_scroll_to_top_html' ) ) :
    /**
     * Scroll to top fnc
     * 
     * @package Newsmatic
     * @since 1.0.0
     */
    function newsmatic_scroll_to_top_html() {
        if( ! ND\newsmatic_get_multiselect_tab_option('stt_responsive_option') ) return;
        $stt_text = ND\newsmatic_get_customizer_option( 'stt_text' );
        $icon = isset( $stt_text['icon'] ) ? $stt_text['icon'] : 'fas fa-ban';
        $icon_text = isset( $stt_text['text'] ) ? $stt_text['text'] : '';
        $stt_alignment = ND\newsmatic_get_customizer_option( 'stt_alignment' );
    ?>
        <div id="newsmatic-scroll-to-top" class="<?php echo esc_attr( 'align--' . $stt_alignment ); ?>">
            <?php if( $icon != 'fas fa-ban' ) : ?>
                <span class="icon-holder"><i class="<?php echo esc_attr( $icon ); ?>"></i></span>
            <?php endif;
                if( $icon_text ) echo '<span class="icon-text">' .esc_html( $icon_text ). '</span>';
            ?>
        </div><!-- #newsmatic-scroll-to-top -->
    <?php
    }
    add_action( 'newsmatic_scroll_to_top_hook', 'newsmatic_scroll_to_top_html' );
 endif;

 if( ! function_exists( 'newsmatic_bottom_footer_menu_part' ) ) :
      /**
       * Bottom Footer menu element
       * 
       * @since 1.0.0
       */
      function newsmatic_bottom_footer_menu_part() {
         $footer_menu_hover_effect = ND\newsmatic_get_customizer_option( 'footer_menu_hover_effect' );
         $element_class = 'bottom-menu';
         if( $footer_menu_hover_effect !== 'none' ) $element_class .= ' hover-effect--' . $footer_menu_hover_effect;
         ?>
            <div class="<?php echo esc_attr( $element_class ); ?>">
               <?php
               if( has_nav_menu( 'menu-3' ) ) :
                  wp_nav_menu(
                     array(
                        'theme_location' => 'menu-3',
                        'menu_id'        => 'bottom-footer-menu',
                        'depth' => 1
                     )
                  );
                  else :
                     if ( is_user_logged_in() && current_user_can( 'edit_theme_options' ) ) {
                        ?>
                           <a href="<?php echo esc_url( admin_url( '/nav-menus.php?action=locations' ) ); ?>"><?php esc_html_e( 'Setup Bottom Footer Menu', 'newsmatic' ); ?></a>
                        <?php
                     }
                  endif;
               ?>
            </div>
         <?php
      }
      add_action( 'newsmatic_footer_menu_hook', 'newsmatic_bottom_footer_menu_part', 30 );
 endif;

 if( ! function_exists( 'newsmatic_footer_logo_html' ) ) :
    /**
     * Mark: Footer Logo
     * 
     * @since 1.4.0
     */
    function newsmatic_footer_logo_html() {
        $logo_from = ND\newsmatic_get_customizer_option( 'bottom_footer_header_or_custom' );
        $show_site_title = false;
        if( $logo_from == 'header' ) {
            $footer_logo = get_theme_mod( 'custom_logo' );
            if( ! $footer_logo ) $show_site_title = true;
        } else {
            $footer_logo = ND\newsmatic_get_customizer_option( 'bottom_footer_logo_option' );
        };
        ?>
            <div class="footer-logo">
                <?php
                    if( $logo_from !== 'header' ) {
                        if( wp_get_attachment_image( $footer_logo, 'full' ) ) echo '<a href="'. home_url() .'" class="footer-site-logo">'. wp_get_attachment_image( $footer_logo, 'full' ) .'</a>';
                    } else {
                        the_custom_logo();

                        if ( is_front_page() && ! get_custom_logo() ) :
                            echo '<h2 class="site-title"><a href="'. esc_url( home_url( '/' ) ) .'" rel="home">'. get_bloginfo( 'name' ) .'</a></h2>';
                        else :
                            echo '<p class="site-title"><a href="'. esc_url( home_url( '/' ) ) .'" rel="home">'. get_bloginfo( 'name' ) .'</a></p>';
                        endif;
                    }
                ?>
            </div>
        <?php
    }
    add_action( 'newsmaticr_footer_logo_hook', 'newsmatic_footer_logo_html' );
endif;

if( ! function_exists( 'newsmatic_botttom_footer_social_part' ) ) :
   /**
    * Bottom Footer social element
    * 
    * @since 1.0.0
    */
   function newsmatic_botttom_footer_social_part() {
     ?>
        <div class="social-icons-wrap">
           <?php newsmatic_customizer_social_icons( 'footer_' ); ?>
        </div>
     <?php
   }
   add_action( 'newsmatic_footer_social_icons_hook', 'newsmatic_botttom_footer_social_part', 10 );
endif;