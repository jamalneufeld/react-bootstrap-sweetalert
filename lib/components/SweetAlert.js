var React = require('react');
var Radium = require('radium');
var SuccessIcon = require('./SuccessIcon');
var ErrorIcon = require('./ErrorIcon');
var InfoIcon = require('./InfoIcon');
var WarningIcon = require('./WarningIcon');
var CustomIcon = require('./CustomIcon');
var Buttons = require('./Buttons');
var styles = require('../styles/SweetAlertStyles');

var SweetAlert = React.createClass({

    propTypes: {
        type: React.PropTypes.oneOf(['default', 'info', 'success', 'warning', 'danger', 'error', 'input', 'custom']),
        title: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.string]).isRequired,
        content: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.string]),
        onCancel: React.PropTypes.func,
        onConfirm: React.PropTypes.func.isRequired,
        confirmBtnText: React.PropTypes.string,
        cancelBtnText: React.PropTypes.string,
        cancelBtnBsStyle: React.PropTypes.oneOf(['default', 'primary', 'link', 'info', 'success', 'warning', 'danger']),
        confirmBtnBsStyle: React.PropTypes.oneOf(['default', 'primary', 'link', 'info', 'success', 'warning', 'danger']),
        customIcon: React.PropTypes.oneOfType([React.PropTypes.node, React.PropTypes.string]),
        inputPlaceHolder: React.PropTypes.string,
        inputValidationMsg: React.PropTypes.string,
        style: React.PropTypes.object,
        customClass: React.PropTypes.string,
        showCancel: React.PropTypes.bool,
        allowEscape: React.PropTypes.bool,
        hideOverlay: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            type: 'default',
            allowEscape: true,
            inputValidationMsg: 'Please enter a response!',
            customClass: '',
            hideOverlay: false
        };
    },

    getInitialState: function() {
        return {
            inputValue: null,
            showValidationMessage: false
        };
    },

    componentDidMount: function(){
        if (this.props.type === 'input') {
            try {
                this.refs.input.focus(); 
            } catch (e) {
                // whoops
            }
        }
    },

    renderIcon: function() {
        switch (this.props.type) {
            case 'danger':
            case 'error':
                return <ErrorIcon />;
            case 'warning':
                return <WarningIcon />;
            case 'info':
                return <InfoIcon />
            case 'success':
                return <SuccessIcon />
            case 'custom':
                if (this.props.customIcon) {
                    if (typeof this.props.customIcon == 'string') {
                        return <CustomIcon iconUrl={this.props.customIcon} />
                    } else {
                        return this.props.customIcon;
                    }
                }
        }
    },

    onChangeInput: function(e) {
        this.setState({
            inputValue: e.target.value,
            showValidationMessage: false
        });
    },

    renderInput: function() {
        if (this.props.type === 'input') {
            return (
                <div style={{position:'relative'}}>
                    <input 
                        type="text" 
                        ref="input"
                        className="form-control" 
                        value={this.state.inputValue}
                        onChange={this.onChangeInput}
                        onKeyDown={this.onInputKeyDown} 
                        placeholder={this.props.inputPlaceHolder} />
                    {this.state.showValidationMessage && (
                        <div style={styles.inputErrorIcon}>
                            <div style={[styles.inputErrorIconBeforeAfter, styles.inputErrorIconBefore]}></div>
                            <div style={[styles.inputErrorIconBeforeAfter, styles.inputErrorIconAfter]}></div>
                        </div>
                    )}
                </div>
            );
        }
    },

    renderValidationMessage: function() {
        if (this.state.showValidationMessage) {
            return (
                <div style={styles.validationMessage}>
                    <div style={styles.exclamationIcon}>!</div>{this.props.inputValidationMsg}
                </div>
            );
        }
    },

    onConfirm: function() {
        if (this.props.type === 'input') {
            if (this.state.inputValue == null || this.state.inputValue.length < 1) {
                this.setState({
                    showValidationMessage: true
                });
            } else {
                this.props.onConfirm(this.state.inputValue);
            }
        } else {
            this.props.onConfirm();
        }
    },

    onInputKeyDown: function(e) {
        if (e.keyCode == 13) {
            if (this.props.onConfirm) {
                this.onConfirm();
                e.stopPropagation();
            }
        }
    },

    onKeyDown: function(e) {
        if (e.keyCode == 27) {
            if (this.props.allowEscape && this.props.onCancel) {
                this.props.onCancel();
                e.stopPropagation();
            }
        }
    },

    render: function() {
        return (
            <div>
                {!this.props.hideOverlay && (<div style={styles.overlay}></div>)}
                <div style={[styles.sweetAlert, this.props.style]} 
                    onKeyDown={this.onKeyDown} 
                    className={"sweet-alert " + this.props.customClass}>
                    
                    {this.renderIcon()}
                    
                    <h2>{this.props.title}</h2>
                    
                    <div className="text-muted lead">{this.props.content}</div>
                    
                    {this.renderInput()}
                    
                    {this.renderValidationMessage()}

                    <Buttons 
                        onCancel={this.props.onCancel}
                        onConfirm={this.onConfirm}
                        showCancel={this.props.showCancel}
                        confirmBtnText={this.props.confirmBtnText}
                        cancelBtnText={this.props.cancelBtnText}
                        cancelBtnBsStyle={this.props.cancelBtnBsStyle}
                        confirmBtnBsStyle={this.props.confirmBtnBsStyle}
                        focusConfirmBtn={(this.props.type !== 'input')} />

                </div>
            </div>
        );
    }
});

module.exports = Radium(SweetAlert);