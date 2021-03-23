const events = {
    CYPRESS_CONTROL_RUN_BEGIN: 'cypress_control_run_begin',
    CYPRESS_CONTROL_TEST_PASSED: 'cypress_control_test_passed',
    CYPRESS_CONTROL_TEST_FAILED: 'cypress_control_test_failed',
    CYPRESS_CONTROL_BEFORE_RUN: 'cypress_control_before_run',
    CYPRESS_CONTROL_RUN_COMPLETED: 'cypress_control_run_completed',
    CYPRESS_CONTROL_RUN_ERROR: 'cypress_control_run_error',
    CYPRESS_CONTROL_MODULE_INCLUDE_ERROR:
        'cypress_control_module_include_error',
    CYPRESS_CONTROL_START_RUNNER: 'cypress_control_start_runner',
    CYPRESS_CONTROL_STOP_RUNNER: 'cypress_control_stop_runner',
    CYPRESS_CONTROL_STATUS: 'cypress_control_status',
    CYPRESS_CONTROL_SUITE_BEGIN: 'cypress_control_suite_begin',
    CYPRESS_CONTROL_SUITE_END: 'cypress_control_suite_end',
    CYPRESS_CONTROL_TEST_BEGIN: 'cypress_control_test_begin',
    CYPRESS_CONTROL_TEST_PENDING: 'cypress_control_test_pending',
    CYPRESS_CONTROL_TEST_END: 'cypress_control_test_end',
};

export default events;
