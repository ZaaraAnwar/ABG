<?php
    /**
     * Base class for header and footer builder
     * 
     * @package Newsmatic Pro
     * @since 1.4.0
     */
    namespace Newsmatic_Builder;
    use Newsmatic\CustomizerDefault as ND;
    if( ! class_exists( 'Builder_Base' ) ) :
        /**
         * Builder Base class
         * 
         * @since 1.4.0
         */
        class Builder_Base {
            /**
             * Builder classes prefi
             * 
             * @since 1.4.0
             */
            public $prefix_class = 'bb-bldr-';

            /**
             * Original value of the control
             * 
             * @since 1.4.0
             */
            public $original_value;

            /**
             * Builder value
             * 
             * @since 1.4.0
             */
            protected $builder_value;

            /**
             * Array of all columns
             * 
             * @since 1.4.0
             */
            public $columns_array = [];

            /**
             * Array of all column layouts
             * 
             * @since 1.4.0
             */
            public $column_layouts_array = [];

            /**
             * Array of all column alignments
             * 
             * @since 1.4.0
             */
            public $column_alignments_array = [];

            /**
             * Is reponsive 
             * 
             * @since 1.4.0
             */
            public $responsive = 'desktop';

            /**
             * Structure the value so that its easy to render its html
             * 
             * @since 1.4.0
             */
            protected function prepare_value_for_render() {
                if( count( $this->builder_value ) > 0 ) :
                    $structured_value = [];
                    $columns_array_count = count( $this->columns_array );
                    for( $i = 0; $i < $columns_array_count; $i++ ) :
                        foreach( $this->builder_value as $container_id => $container_values ) :
                            $id_split = str_split( $container_id );
                            $row = $id_split[0];
                            if( $row === (string) $i ) $structured_value[ $i ][] = $container_values;
                        endforeach;
                    endfor;
                    $this->builder_value = $structured_value;
                endif;
                // if( ! empty( $this->builder_value ) && is_array( $this->builder_value ) ) $this->builder_value = array_chunk( $this->builder_value, 4 );
            }

            /**
             * Render the HTML
             * 
             * @aince 1.4.0
             */
            protected function render() {
                if( ! empty( $this->builder_value ) && is_array( $this->builder_value ) ) :
                    $this->opening_div();
                        foreach( $this->builder_value as $row_index => $row ) :
                            if( $this->check_if_row_has_widgets( $row ) ) continue;	// check if there are any widgets in this row
                            $this->render_row( $row, $row_index );
                        endforeach;
                        $this->get_mobile_canvas();
                    $this->closing_div();
                endif;
            }

            /**
             * Opening div
             * 
             * @since 1.4.0
             */
            protected function opening_div() {
                $wrapperClass = $this->prefix_class . '-normal';
                echo '<div class="'. esc_attr( $wrapperClass ) .'">';
            }

            /**
             * Closing div
             * 
             * @since 1.4.0
             */
            protected function closing_div() {
                echo '</div>';
            }

            /**
             * Get widgets count in row
             * 
             * @since 1.4.0
             */
            protected function check_if_row_has_widgets( $row ) {
                /* merging widgets of all three columns to check if widgets exist of not */
                if( count( $row ) > 0 ) :
                    $row_widgets = array_reduce( $row, function( $carry, $item ) {
                        return array_merge( $carry, is_array( $item ) ? $item : [ $item ] );
                    }, [] );
                    if( count( $row_widgets ) > 0 ) return false;
                endif;
                return true;
            }

            /**
             * Render all the rows
             * 
             * @since 1.4.0
             */
            protected function render_row( $row, $index ) {
                $rowClass = $this->prefix_class . 'row';
                $rowClass .= ' column-' . $this->columns_array[ $index ];
                if( $this->responsive === 'desktop' ) :
                    $rowClass .= ' layout-' . $this->column_layouts_array[ $index ]['desktop'];
                else:
                    $rowClass .= ' tablet-layout-' . $this->column_layouts_array[ $index ]['tablet'];
                    $rowClass .= ' smartphone-layout-' . $this->column_layouts_array[ $index ]['smartphone'];
                endif;
                $row_sticky = ND\newsmatic_get_customizer_option( 'header_'. $this->get_ordinals( $index + 1 ) .'_row_header_sticky' );
                $rowClass .= $this->get_extra_row_classes( $index );
                $rowWrapClass = 'row-wrap';
                $rowWrapClass .= ' row-' . $this->convert_to_string( $index + 1 );
                $rowWrapClass .= $this->get_extra_row_wrap_classes( $index );
                if( $row_sticky ) $rowWrapClass .= ' row-sticky';
                ?>
                    <div class="<?php echo esc_attr( $rowWrapClass ); ?>">
                        <div class="newsmatic-container">
                            <div class="row">
                                <div class="<?php echo esc_attr( $rowClass ); ?>">
                                    <?php
                                        foreach( $row as $column_index => $column ) :
                                            $this->render_column( $column, $column_index, $index );
                                            if( ( $column_index + 1 ) >= $this->columns_array[ $index ] ) break;
                                        endforeach;
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                <?php
            }

            /**
             * Render all the columns
             * 
             * @since 1.4.0
             */
            protected function render_column( $column, $index, $row_index ) {
                $columnClass = $this->prefix_class . 'column';
                if( empty( $column ) ) $columnClass .= ' is-empty';
                $columnClass .= ' ' . $this->convert_to_string( $index + 1 );
                $column_alignments = $this->column_alignments_array[ $row_index ][ $index ];
                if( $this->responsive === 'desktop' ) :
                    $columnClass .= ' alignment-' . $this->column_alignments_array[ $row_index ][ $index ]['desktop'];
                else:
                    $columnClass .= ' tablet-alignment--' . $this->column_alignments_array[ $row_index ][ $index ][ 'tablet' ];
                    $columnClass .= ' smartphone-alignment--' . $this->column_alignments_array[ $row_index ][ $index ][ 'smartphone' ];
                endif;
                $columnClass .= $this->get_extra_column_classes( $row_index, $index );
                ?>
                    <div class="<?php echo esc_attr( $columnClass ); ?>">
                        <?php
                            foreach( $column as $widget_index => $widget ) :
                                $this->render_widget( $widget, $widget_index );
                            endforeach;
                        ?>
                    </div>
                <?php
            }

            /**
             * Render all the columns
             * 
             * @since 1.4.0
             */
            protected function render_widget( $widget, $index ) {
                $widgetClass = $this->prefix_class . 'widget';
                if( $widget === 'you-may-have-missed' ) $widgetClass .= ' builder-ymhm-widget';
                if( in_array( $widget, [ 'sidebar-one', 'sidebar-two', 'sidebar-three', 'sidebar-four' ] ) ) $widgetClass .= ' has-sidebar';
                if( in_array( $widget, [ 'ticker-news' ] ) ) $widgetClass .= ' has-ticker';
                if( ( $widget === 'image' ) && ND\newsmatic_get_customizer_option( 'use_ad_outside_of_header' ) ) return;
                if( $widget === 'button' ) :
                    $custom_button_make_absolute = ND\newsmatic_get_customizer_option( 'custom_button_make_absolute' );
                    if( $custom_button_make_absolute ) $widgetClass .= ' custom-button-absolute';
                endif;
                if( $widget === 'scroll-to-top' ) $widgetClass .= ' scroll-to-top-widget';
                ?>
                    <div class="<?php echo esc_attr( $widgetClass ); ?>">
                        <?php
                            $this->get_widget_html( $widget );
                        ?>
                    </div>
                <?php
            } 

            /**
             * Convert number to string
             * 
             * @since 1.4.0
             */
            protected function convert_to_string( $number ) {
                if( ! $number ) return;
                switch( $number ) :
                    case 2:
                        return 'two';
                        break;
                    case 3:
                        return 'three';
                        break;
                    case 4:
                        return 'four';
                        break;
                    default: 
                        return 'one';
                endswitch;
            }

            /**
             * Mobile canvas
             * 
             * @since 1.4.0
             */
            public function get_mobile_canvas() {}

            /**
             * Get extra row classes
             * 
             * @since 1.4.0
             */
            public function get_extra_row_classes( $row_index ) {}

            /**
             * Get extra row wrap classes
             * 
             * @since 1.4.0
             */
            public function get_extra_row_wrap_classes( $row_index ) {}

            /**
             * Get extra column classes
             * 
             * @since 1.4.0
             */
            public function get_extra_column_classes( $row_index, $column_index ) {}

            /**
             * Check if Widget exists
             * 
             * @since 1.4.0
             */
            public static function widget_exists( $control_id = '', $to_search = '' ) {
                if( $control_id === '' || $to_search === '' ) return false;
                $control = ND\newsmatic_get_customizer_option( $control_id );
                if( ! empty( $control ) && is_array( $control ) ) :
                    $exists = false;
                    foreach( $control as $widgets ) :
                        if( ! empty( $widgets ) && in_array( $to_search, $widgets ) ) :
                            $exists = true;
                            break;
                        endif;
                    endforeach;
                    return $exists;
                endif;
                return false;
            }

            /**
             * Get ordinals
             */
            public function get_ordinals( $number ) {
                switch( $number ) :
                    case 1:
                        return 'first';
                        break;
                    case 2:
                        return 'second';
                        break;
                    case 3:
                        return 'third';
                        break;
                endswitch;
            }
        }
    endif;