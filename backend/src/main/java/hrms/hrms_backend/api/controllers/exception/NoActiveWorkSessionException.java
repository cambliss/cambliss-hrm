package hrms.hrms_backend.api.controllers.exception;

public class NoActiveWorkSessionException extends RuntimeException {

    public NoActiveWorkSessionException(String message) {
        super(message);
    }
}