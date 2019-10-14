import React, {Component} from 'react';
import {withRouter}       from 'react-router-dom';
import {connect}          from 'react-redux';
import classNames         from 'classnames';
import PropTypes          from 'prop-types';
import Topbar             from './topbar/Topbar';
import Sidebar            from './sidebar/Sidebar';

import {changeThemeToDark, changeThemeToLight}                  from '../../redux/actions/themeActions';
import {changeMobileSidebarVisibility, changeSidebarVisibility} from '../../redux/actions/sidebarActions';
import {CustomizerProps, SidebarProps, ThemeProps}              from '../../shared/prop-types/ReducerProps';

class Layout extends Component {
	static propTypes = {
		dispatch  : PropTypes.func.isRequired,
		sidebar   : SidebarProps.isRequired,
		customizer: CustomizerProps.isRequired,
		theme     : ThemeProps.isRequired,
	};


	changeSidebarVisibility = () => {
		const {dispatch} = this.props;
		dispatch(changeSidebarVisibility());
	};

	changeMobileSidebarVisibility = () => {
		const {dispatch} = this.props;
		dispatch(changeMobileSidebarVisibility());
	};

	changeToDark = () => {
		const {dispatch} = this.props;
		dispatch(changeThemeToDark());
	};

	changeToLight = () => {
		const {dispatch} = this.props;
		dispatch(changeThemeToLight());
	};

	render() {
		const {customizer, sidebar, theme} = this.props;
		const layoutClass                  = classNames({
			layout            : true,
			'layout--collapse': sidebar.collapse,
		});

		return (
			<div className={layoutClass}>
				{/*<Customizer
				 customizer={customizer}
				 sidebar={sidebar}
				 theme={theme}
				 changeSidebarVisibility={this.changeSidebarVisibility}
				 toggleTopNavigation={this.toggleTopNavigation}
				 changeToDark={this.changeToDark}
				 changeToLight={this.changeToLight}
				 changeBorderRadius={this.changeBorderRadius}
				 toggleBoxShadow={this.toggleBoxShadow}
				 />*/}
				{customizer.topNavigation
				 ? (
					 <TopbarWithNavigation
						 changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
					 />
				 )
				 : (
					 <Topbar
						 changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
						 changeSidebarVisibility={this.changeSidebarVisibility}
					 />
				 )
				}
				{customizer.topNavigation
				 ? (
					 <SidebarMobile
						 sidebar={sidebar}
						 changeToDark={this.changeToDark}
						 changeToLight={this.changeToLight}
						 changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
					 />
				 )
				 : (
					 <Sidebar
						 sidebar={sidebar}
						 changeToDark={this.changeToDark}
						 changeToLight={this.changeToLight}
						 changeMobileSidebarVisibility={this.changeMobileSidebarVisibility}
					 />
				 )
				}
			</div>
		);
	}
}

export default withRouter(connect(state => ({
	customizer: state.customizer,
	sidebar   : state.sidebar,
	theme     : state.theme,
}))(Layout));
