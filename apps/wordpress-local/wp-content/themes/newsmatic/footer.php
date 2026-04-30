<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Newsmatic
 */
require get_template_directory() . '/builder/footer-builder.php';
use Newsmatic_Builder as NB;
use Newsmatic\CustomizerDefault as ND;
 if( did_action( 'elementor/loaded' ) && class_exists( 'Nekit_Render_Templates_Html' ) ) :
	$Nekit_render_templates_html = new Nekit_Render_Templates_Html();
	if( $Nekit_render_templates_html->is_template_available('footer') ) {
		$footer_rendered = true;
		echo $Nekit_render_templates_html->current_builder_template();
	} else {
		$footer_rendered = false;
	}
else :
	$footer_rendered = false;
endif;

if( ! $footer_rendered ) :
 /**
  * hook - newsmatic_before_footer_section
  * 
  */
  do_action( 'newsmatic_before_footer_section' );
  
  $footer_section_width = ND\newsmatic_get_customizer_option( 'footer_section_width' );
  $footer_class = 'site-footer dark_bk ' . $footer_section_width;
?>
	<footer id="colophon" class="<?php echo esc_attr( $footer_class );?>">
		<?php
			new NB\Footer_Builder_Render();
		?>
	</footer><!-- #colophon -->
	<?php
		/**
		* hook - newsmatic_after_footer_hook
		*
		* @hooked - newsmatic_scroll_to_top
		*
		*/
		if( has_action( 'newsmatic_after_footer_hook' ) ) {
			do_action( 'newsmatic_after_footer_hook' );
		}
endif;
?>
</div><!-- #page -->

<?php wp_footer(); ?>
</body>
</html>