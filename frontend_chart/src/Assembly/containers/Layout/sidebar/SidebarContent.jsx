import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    changeToDark: PropTypes.func.isRequired,
    changeToLight: PropTypes.func.isRequired,
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };

  render() {
    const { changeToDark, changeToLight } = this.props;
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarCategory title="Categories" icon="diamond">
				<SidebarLink title="Master page" route="/pages/master-page" onClick={this.hideSidebar} />
	            <SidebarLink title="Alarm master" route="/pages/alarm-master" onClick={this.hideSidebar} />
	            <SidebarLink title="Mapping Arduino Stitch" route="/pages/mapping-stitch" onClick={this.hideSidebar} />
	            <SidebarLink title="Lead time" route="/pages/lead-time" onClick={this.hideSidebar} />
	            <SidebarLink title="Lead time Detail" route="/pages/lead-time-detail" onClick={this.hideSidebar} />
	            <SidebarLink title="Alarm History" route="/pages/alarm-history" onClick={this.hideSidebar} />
	            <SidebarLink title="Machine Alarm Status" route="/pages/machine-alarm-status" onClick={this.hideSidebar} />
	            <SidebarLink title="Sensing Value" route="/pages/sensing-value" onClick={this.hideSidebar} />
	            <SidebarLink title="Learning Curve" route="/pages/learning-curve" onClick={this.hideSidebar} />
	            <SidebarLink title="Defect Status" route="/pages/defect-status" onClick={this.hideSidebar} />
	            <SidebarLink title="Defect Summary" route="/pages/defect-summary" onClick={this.hideSidebar} />
	            <SidebarLink title="Overview" route="/pages/overview" onClick={this.hideSidebar} />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
