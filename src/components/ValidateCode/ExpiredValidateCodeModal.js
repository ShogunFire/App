import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import _, {compose} from 'underscore';
import lodashGet from 'lodash/get';
import {View} from 'react-native';
import colors from '../../styles/colors';
import styles from '../../styles/styles';
import Icon from '../Icon';
import withLocalize, {withLocalizePropTypes} from '../withLocalize';
import Text from '../Text';
import * as Expensicons from '../Icon/Expensicons';
import * as Illustrations from '../Icon/Illustrations';
import variables from '../../styles/variables';
import TextLink from '../TextLink';
import ONYXKEYS from '../../ONYXKEYS';
import * as ErrorUtils from '../../libs/ErrorUtils';

const propTypes = {

    /** Whether the user can a new validate code from the current page */
    shouldShowRequestCodeLink: PropTypes.bool,

    /** Callback to be called when user clicks the request code link */
    onRequestCodeClick: PropTypes.func,

    ...withLocalizePropTypes,
};

const defaultProps = {
    shouldShowRequestCodeLink: false,
    onRequestCodeClick: () => {},
};

class ExpiredValidateCodeModal extends PureComponent {
    render() {
        const codeRequestedMessage = lodashGet(this.props, 'account.message', null);
        const accountErrors = lodashGet(this.props, 'account.errors', {});
        let codeRequestedErrors;
        if (_.keys(accountErrors).length > 1) {
            codeRequestedErrors = ErrorUtils.getLatestErrorMessage(this.props.account);
        }
        return (
            <View style={styles.deeplinkWrapperContainer}>
                <View style={styles.deeplinkWrapperMessage}>
                    <View style={styles.mb2}>
                        <Icon
                            width={variables.modalTopIconWidth}
                            height={variables.modalTopIconHeight}
                            src={Illustrations.ToddBehindCloud}
                        />
                    </View>
                    <Text style={[styles.textHeadline, styles.textXXLarge, styles.textAlignCenter]}>
                        {this.props.translate('validateCodeModal.expiredCodeTitle')}
                    </Text>
                    <View style={[styles.mt2, styles.mb2]}>
                        <Text style={[styles.fontSizeNormal, styles.textAlignCenter]}>
                            {this.props.translate('validateCodeModal.expiredCodeDescription')}
                            {this.props.shouldShowRequestCodeLink && !codeRequestedMessage
                                && (
                                    <>
                                        <br />
                                        {this.props.translate('validateCodeModal.requestNewCode')}
                                        {' '}
                                        <TextLink onPress={this.props.onRequestCodeClick}>
                                            {this.props.translate('validateCodeModal.requestNewCodeLink')}
                                        </TextLink>
                                        !
                                    </>
                                )}
                        </Text>
                        {this.props.shouldShowRequestCodeLink && codeRequestedErrors
                            && (
                                <Text style={[styles.textDanger, styles.validateCodeMessage]}>
                                    <br />
                                    <br />

                                    {codeRequestedErrors}

                                </Text>
                            )}
                        {this.props.shouldShowRequestCodeLink && codeRequestedMessage
                            && (
                                <Text style={styles.validateCodeMessage}>
                                    <br />
                                    <br />
                                    {codeRequestedMessage}
                                </Text>
                            )}
                    </View>
                </View>
                <View style={styles.deeplinkWrapperFooter}>
                    <Icon
                        width={variables.modalWordmarkWidth}
                        height={variables.modalWordmarkHeight}
                        fill={colors.green}
                        src={Expensicons.ExpensifyWordmark}
                    />
                </View>
            </View>
        );
    }
}

ExpiredValidateCodeModal.propTypes = propTypes;
ExpiredValidateCodeModal.defaultProps = defaultProps;
export default compose(
    withLocalize,
    withOnyx({
        account: {key: ONYXKEYS.ACCOUNT},
    }),
)(ExpiredValidateCodeModal);