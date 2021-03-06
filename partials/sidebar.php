<div class="sidebar" data-color="white" data-active-color="danger">

  <div class="logo" style="padding-left: 2rem">
    <a class="navbar-brand" href="https://teenus.com.co/tezlik/" target="_blank">
      <img src="/favicon.ico" width="25">
      <img src="../../upload/img/logo_tezlik.png" width="90">
    </a>
  </div>
  <div class="sidebar-wrapper">
    <ul class="nav">
      <li><a href="#"><b>Menu</b></a></li>
      <hr class="my-0">
      <?php if ($user->getRolId() == 2) { ?>
        <li class="active" id="sidebar-parametrizar-item">
          <a data-toggle="collapse" href="#collapseParametrizar" role="button" aria-expanded="false" aria-controls="collapseParametrizar">
            <i class="fa fa-wrench" aria-hidden="true"></i>
            <p class="text-capitalize">Configurar</p>
          </a>
        </li>

        <div class="collapse" id="collapseParametrizar">
          <ul class="nav">
            <li>
              <a href="/app/config-general/">
                <i class="fa fa-cogs" style="margin-left: 30px;"></i>
                <p class="text-capitalize general">General</p>
              </a>
            </li>
            <li id="sidebar-products-item">
              <a href="/app/products/">
                <i class="fa fa-industry" aria-hidden="true" style="margin-left: 30px;"></i>
                <p class="text-capitalize productos">Productos</p>
              </a>
          </ul>
        </div>
      <?php } ?>
      <?php //if ($user->getRolId() != 44) { ?>
        <li id="sidebar-costear-item">
          <a href="/app/cost/">
            <i class="fa fa-check"></i>
            <p>Análisis</p>
          </a>
        </li>
      <?php //} ?>
      <li id="sidebar-reportes-item">
        <a href="/app/reportes/">
          <i class="fa fa-flag"></i>
          <p>Reportes</p>
        </a>
      </li>
      <li id="sidebar-analisis-item">
        <a href="/app/Analisis/">
          <i class="fa fa-bolt"></i>
          <p>Optimización</p>
        </a>
      </li>

      <hr class="my-0">
      <li><a data-toggle="collapse" href="#collapse-herramientas" role="button" aria-expanded="false" aria-controls="collapse-herramientas"><b>Herramientas</b></a></li>
      <hr class="my-0">
      <div class="collapse" id="collapse-herramientas">
        <ul class="nav">
          <li id="sidebar-calculator-item">
            <a href="/app/tools/calculator_hours_extra.php">
              <i class="nc-icon nc-watch-time"></i>
              <p>Calculadora Horas Extras</p>
            </a>
          </li>
          <li id="sidebar-conversor-item">
            <a href="/app/tools/conversor.php">
              <i class="nc-icon nc-spaceship"></i>
              <p>Conversor de Unidades</p>
            </a>
          </li>
          <li id="sidebar-tutorial-item">
            <a href="/app/tools/tutorials.php">
              <!-- <a href="#"> -->
              <i class="nc-icon nc-button-play"></i>
              <p>Tutoriales</p>
            </a>
          </li>
          <li id="sidebar-report-item">
            <a href="#" id="modalSupportLink">
              <i class="nc-icon nc-support-17"></i>
              <p>Soporte</p>
            </a>
          </li>
        </ul>
      </div>
      <?php if ($user->getRolId() == 2) { ?>
        <hr class="my-0">
        <li><a data-toggle="collapse" href="#collapse-administrator" role="button" aria-expanded="false" aria-controls="collapse-administrator"><b>Administrador</b></a></li>
        <hr class="my-0">
        <div class="collapse" id="collapse-administrator">
          <ul class="nav">
            <li id="sidebar-users-item">
              <a href="/app/users">
                <i class="nc-icon nc-single-02"></i>
                <p>Usuarios</p>
              </a>
            </li>
          </ul>
        </div>
      <?php } ?>
    </ul>
  </div>
</div>