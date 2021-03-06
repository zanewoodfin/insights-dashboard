import './SystemInventoryCard.scss';

import * as AppActions from '../../AppActions';

import React, { useEffect } from 'react';
import { TemplateCard, TemplateCardBody, TemplateCardHeader } from '../../PresentationalComponents/Template/TemplateCard';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import FailState from '../../PresentationalComponents/FailState/FailState';
import { IconInline } from '../../PresentationalComponents/IconInline/IconInline';
import { NumberDescription } from '../../../../insights-dashboard/src/PresentationalComponents/NumberDescription/NumberDescription';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import messages from '../../Messages';
import { useIntl } from 'react-intl';

/**
 * System inventory card for showing system inventory and status.
 */
const SystemInventoryCard = ({
    fetchInventory, inventoryFetchStatus, inventorySummary,
    fetchInventoryStale, inventoryStaleFetchStatus, inventoryStaleSummary,
    fetchInventoryWarning, inventoryWarningFetchStatus, inventoryWarningSummary,
    fetchInventoryTotal, inventoryTotalFetchStatus, inventoryTotalSummary
}) => {

    useEffect(() => {
        fetchInventoryTotal();
        fetchInventory();
        fetchInventoryStale();
        fetchInventoryWarning();
    }, [fetchInventoryTotal,
        fetchInventory,
        fetchInventoryStale,
        fetchInventoryWarning]
    );

    const intl = useIntl();

    return <TemplateCard appName='SystemInventory'>
        <TemplateCardHeader subtitle={ intl.formatMessage(messages.systemInventoryTitle) }/>
        <TemplateCardBody isFilled={ false } className='dashboard-card-system-inventory-body'>
            { inventoryFetchStatus === 'fulfilled' && inventoryTotalFetchStatus === 'fulfilled' &&
                <NumberDescription
                    data={ inventorySummary.total.toLocaleString() || 0 }
                    dataSize="lg"
                    percentageData={ intl.formatMessage(messages.systemInventoryPercentageData,
                        { count: Math.floor((inventorySummary.total / inventoryTotalSummary.total) * 100) || 0 }
                    ) }
                    linkDescription = { intl.formatMessage(messages.systemInventoryDescription,
                        { count: inventorySummary.total || 0 }
                    ) }
                    link='./insights/inventory'
                    iconTooltipText = { intl.formatMessage(messages.systemInventoryNotUsingClient,
                        { count: inventoryTotalSummary.total - inventorySummary.total || 0 }
                    ) }
                />
            }
            { inventoryStaleFetchStatus === 'fulfilled' &&
                <Button component="a" variant="link" href='./insights/inventory/?status=stale' isInline>
                    <IconInline
                        message={ intl.formatMessage(messages.systemInventoryStale,
                            { count: inventoryStaleSummary.total || 0 }
                        ) }
                        state="warning"
                        systemInventory="true"
                    />
                </Button>
            }
            { inventoryWarningFetchStatus === 'fulfilled' &&
                <Button component="a" variant="link" href='./insights/inventory/?status=stale_warning' isInline>
                    <IconInline
                        message={ intl.formatMessage(messages.systemInventoryStaleWarning,
                            { count: inventoryWarningSummary.total || 0 }
                        ) }
                        state="critical"
                        systemInventory="true"
                    />
                </Button>
            }
            { inventoryTotalFetchStatus === 'rejected' &&
                <FailState appName='Inventory' isSmall/>
            }
        </TemplateCardBody>
    </TemplateCard>;
};

SystemInventoryCard.propTypes = {
    fetchInventory: PropTypes.func,
    inventorySummary: PropTypes.object,
    inventoryFetchStatus: PropTypes.string,
    fetchInventoryStale: PropTypes.func,
    inventoryStaleSummary: PropTypes.object,
    inventoryStaleFetchStatus: PropTypes.string,
    fetchInventoryWarning: PropTypes.func,
    inventoryWarningSummary: PropTypes.object,
    inventoryWarningFetchStatus: PropTypes.string,
    fetchInventoryTotal: PropTypes.func,
    inventoryTotalSummary: PropTypes.object,
    inventoryTotalFetchStatus: PropTypes.string,
    intl: PropTypes.any
};

export default connect(
    ({ DashboardStore }) => ({
        inventorySummary: DashboardStore.inventorySummary,
        inventoryFetchStatus: DashboardStore.inventoryFetchStatus,
        inventoryStaleSummary: DashboardStore.inventoryStaleSummary,
        inventoryStaleFetchStatus: DashboardStore.inventoryStaleFetchStatus,
        inventoryWarningSummary: DashboardStore.inventoryWarningSummary,
        inventoryWarningFetchStatus: DashboardStore.inventoryWarningFetchStatus,
        inventoryTotalSummary: DashboardStore.inventoryTotalSummary,
        inventoryTotalFetchStatus: DashboardStore.inventoryTotalFetchStatus
    }),
    dispatch => ({
        fetchInventory: () => dispatch(AppActions.fetchInventorySummary()),
        fetchInventoryStale: () => dispatch(AppActions.fetchInventoryStaleSummary()),
        fetchInventoryWarning: () => dispatch(AppActions.fetchInventoryWarningSummary()),
        fetchInventoryTotal: () => dispatch(AppActions.fetchInventoryTotalSummary())
    })
)(SystemInventoryCard);
