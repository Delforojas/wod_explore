-- Issue #28: support user history pagination and deterministic ordering.
ALTER TABLE wod_results
    ADD INDEX wod_results_user_completed_id_idx (user_id, completed_at, id);

ALTER TABLE exercise_results
    ADD INDEX exercise_results_user_performed_id_idx (user_id, performed_at, id);
