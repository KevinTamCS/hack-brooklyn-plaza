package org.hackbrooklyn.plaza.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
public class TeamFormationParticipantFormDataWithBrowserVisibilityDTO extends TeamFormationParticipantFormDataDTO {

    public TeamFormationParticipantFormDataWithBrowserVisibilityDTO(@NotNull @Size(min = 1, max = 5) Set<String> interestedTopicsAndSkills, @NotBlank String specialization, @NotBlank String objectiveStatement, @NotBlank String contactInfo, boolean visibleInBrowser) {
        super(interestedTopicsAndSkills, specialization, objectiveStatement, contactInfo);
        this.visibleInBrowser = visibleInBrowser;
    }

    @NotNull
    private boolean visibleInBrowser;
}
