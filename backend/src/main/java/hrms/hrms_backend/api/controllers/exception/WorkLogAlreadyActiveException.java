package hrms.hrms_backend.api.controllers.exception;

public class WorkLogAlreadyActiveException extends RuntimeException {

    public WorkLogAlreadyActiveException(String message) {
        super(message);
    }
}