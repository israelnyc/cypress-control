const events =  {
    CYPRESS_DASHBOARD_RUN_BEGIN: 'cypress_dashboard_run_begin',
    CYPRESS_DASHBOARD_TEST_PASSED: 'cypress_dashboard_test_passed',
    CYPRESS_DASHBOARD_TEST_FAILED: 'cypress_dashboard_test_failed',
    CYPRESS_DASHBOARD_BEFORE_RUN: 'cypress_dashboard_before_run',
    CYPRESS_DASHBOARD_RUN_COMPLETED: 'cypress_dashboard_run_completed',
    CYPRESS_DASHBOARD_RUN_ERROR: 'cypress_dashboard_run_error',
    CYPRESS_DASHBOARD_MODULE_INCLUDE_ERROR: 'cypress_dashboard_module_include_error',
    CYPRESS_DASHBOARD_START_RUNNER: 'cypress_dashboard_start_runner',
    CYPRESS_DASHBOARD_STOP_RUNNER: 'cypress_dashboard_stop_runner',
    CYPRESS_DASHBOARD_STATUS: 'cypress_dashboard_status'    
}

export default events