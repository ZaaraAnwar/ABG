(function(api, $) {
    const { custom_callback: customCallback } = customizerExtrasObject

    /**
     * Contextual
     * 
     * @since 1.4.0
     */
    $.each( customCallback, function( controlId, controlValue ) {
        wp.customize( controlId, function( value ) {
            value.bind( function( to ) {
                $.each( controlValue, function( index, toToggle ){
                    if( JSON.stringify( to ) == index ) {
                        $.each( toToggle, function( key, val ){
                            wp.customize.control( val ).activate()
                        })
                    } else {
                        $.each( toToggle, function( key, val ){
                            wp.customize.control( val ).deactivate()
                        })
                    }
                })
                if( to in controlValue ) {
                    $.each( controlValue[to], function( key, val ){
                        wp.customize.control( val ).activate()
                    })
                }
            });
        });    
    })

    /**
     * Builder Handler
     * 
     * @since 1.4.0
     */
    const builderHandler = {
        init: function(){
            this.headerBuilder();
            this.footerBuilder();
            this.addActiveClasses();
        },
        widgetSections: {},
        headerBuilderId: '',
        footerBuilderId: '',
        headerBuilder: function() {
            this.headerBuilderId = 'header_builder'
            this.widgetSections['header'] = this.builderBehaviour( this.headerBuilderId )
        },
        footerBuilder: function() {
            this.footerBuilderId = 'footer_builder'
            this.widgetSections['footer'] = this.builderBehaviour( this.footerBuilderId )
        },
        builderBehaviour: function( controlId ){
            let controlInstance = api.control( controlId )
            const { widgets, builder_settings_section } = controlInstance.params
            let widgetSections = this.getWidgetSections( widgets )
            return [ ...widgetSections, builder_settings_section ]
        },
        getWidgetSections: function( widgets ){
            return Object.values( widgets ).reduce(( newValue, widgetValue ) => {
                const { section } = widgetValue
                newValue = [ ...newValue, section ]
                return newValue
            }, [])
        },
        addActiveClasses: function(){
            const widgetSections = this.widgetSections,
                { header, footer } = widgetSections,
                headerBuilderId = this.headerBuilderId,
                footerBuilderId = this.footerBuilderId

            api.section.each(( sectionInstance, sectionID ) => {
                sectionInstance.expanded.bind(function( isExpanded ){
                    if( isExpanded ) {
                        if( sectionInstance.contentContainer.hasClass( 'newsmatic-builder-related' ) ) {
                            let builderId = ''
                            if( header.includes( sectionID ) ) {
                                builderId = headerBuilderId
                            }
                            if( footer.includes( sectionID ) ) {
                                builderId = footerBuilderId
                            }
                            if( builderId !== '' ) {
                                let controlInstance = api.control( builderId )
                                const { builder_settings_section } = controlInstance.params
                                const { container } = controlInstance
                                const builderSettingsSection = api.section( builder_settings_section ).contentContainer
                                container.parent().addClass( 'is-active' ).siblings().removeClass( 'is-active' )
                                builderSettingsSection.addClass( 'active-builder-setting' ).siblings().removeClass( 'active-builder-setting' )
                                builderSettingsSection.parents( '#customize-controls' ).siblings('#customize-preview').addClass( 'newsmatic-builder--on' )
                            }
                        } else {
                            if( $('.newsmatic-builder.is-active') ) $('.newsmatic-builder.is-active').removeClass( 'is-active' )
                            if( $('.newsmatic-builder-related.active-builder-setting') ) $('.newsmatic-builder-related.active-builder-setting').removeClass( 'active-builder-setting' )
                            $('#customize-preview').removeClass( 'newsmatic-builder--on' )
                        }
                    }
                })
            })
        }
    }
    $( document ).ready(function(){
        builderHandler.init()
    })
})( wp.customize, jQuery )